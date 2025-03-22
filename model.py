import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import MessagePassing

class LightGCN(MessagePassing):
    def __init__(self, num_nodes, embedding_dim=64, num_layers=3):
        super(LightGCN, self).__init__(aggr='add')
        self.num_layers = num_layers
        self.embedding = nn.Embedding(num_nodes, embedding_dim)
        nn.init.xavier_uniform_(self.embedding.weight)

    def forward(self, edge_index):
        embeddings = self.embedding.weight
        all_emb = [embeddings]

        for _ in range(self.num_layers):
            embeddings = self.propagate(edge_index, x=embeddings)
            all_emb.append(embeddings)

        final_emb = torch.mean(torch.stack(all_emb, dim=0), dim=0)
        return final_emb

    def message(self, x_j):
        return x_j

    def recommend_by_books(self, interacted_books, top_k=5):
        """
        Recommend books based on a list of interacted books.
        - `interacted_books`: List/Tensor of book indices.
        - `top_k`: Number of books to recommend.
        """
        with torch.no_grad():
            all_embeddings = self.embedding.weight  # Get all embeddings

            if isinstance(interacted_books, list):
                interacted_books = torch.tensor(interacted_books, dtype=torch.long, device=all_embeddings.device)

            # Average embedding of interacted books
            user_embedding = all_embeddings[interacted_books].mean(dim=0)

            # Compute similarity with all books
            scores = torch.matmul(all_embeddings, user_embedding)
            recommended_indices = torch.topk(scores, top_k + len(interacted_books)).indices.tolist()

        # Remove already interacted books
        recommended_indices = [idx for idx in recommended_indices if idx not in interacted_books][:top_k]
        return recommended_indices

    def recommend_by_users(self, user_ids, top_k=5):
        """
        Recommend books based on a list of user IDs.
        - `user_ids`: List/Tensor of user indices (as per model's mapping).
        - `top_k`: Number of books to recommend.
        """
        with torch.no_grad():
            all_embeddings = self.embedding.weight

            if isinstance(user_ids, list):
                user_ids = torch.tensor(user_ids, dtype=torch.long, device=all_embeddings.device)

            # Aggregate embeddings for multiple users (mean)
            user_embeddings = all_embeddings[user_ids].mean(dim=0)

            # Compute similarity with all books
            scores = torch.matmul(all_embeddings, user_embeddings)
            recommended_indices = torch.topk(scores, top_k + len(user_ids)).indices.tolist()

        # Remove user IDs (we only need book recommendations)
        recommended_indices = [idx for idx in recommended_indices if idx not in user_ids][:top_k]
        return recommended_indices
