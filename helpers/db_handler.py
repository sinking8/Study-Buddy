import os
import warnings

from langchain_openai import OpenAIEmbeddings
from sklearn.feature_extraction.text import TfidfVectorizer

import singlestoredb as s2
from langchain.vectorstores import SingleStoreVectorStore

class DB:
    conn = None
    def __init__(self):

        # Retrieve Embeddings
        self.embeddings = OpenAIEmbeddings()

        # Connect to the database
        self.connect_db()

    def connect_db(self):
        self.conn = s2.connect(os.environ['SINGLESTORE'])
        
    
    def retrieve_top_k_topics(self,session_id='1'):
        try:
            with self.conn:
                with self.conn.cursor() as cur:
                    q_string = "SELECT doc FROM calhacks.SESSION WHERE session_id = %s"
                    cur.execute(q_string, (session_id,))

                    # Retrieve the documents
                    docs = cur.fetchall()

            # Retrieve the top k topics
            return True,list(set(self.retrieve_top_k_unique_keywords(docs, K=5)))
        
        except Exception as e:
            warnings.warn(f"Error in retrieve_top_k_topics: {e}")
            return False,e
            
    def retrieve_top_k_unique_keywords(self, docs, K=5):
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([doc[0] for doc in docs]).toarray()
        top_k_keywords = tfidf_matrix.argsort()[:K].flatten()
        return [vectorizer.get_feature_names_out()[i] for i in top_k_keywords]
    
    def retrieve_docs_based_on_chosen_topics(self, session_id,search_string):
        try:
            with self.conn.cursor() as cur:
                q_string = "SELECT doc FROM calhacks.SESSION WHERE session_id = %s"
                cur.execute(q_string, (session_id,))

                # Retrieve the documents
                docs = cur.fetchall()

            # Perform vector similarity search using langchain RAG
            query_vector = self.embeddings.embed_query(search_string)
            doc_vectors = [self.embeddings.embed_query(doc[0]) for doc in docs]

            # Use langchain's vector search method
            vector_store = SingleStoreVectorStore.from_documents(
                documents=[doc[0] for doc in docs],
                embedding=self.embeddings
            )

            # Perform the search
            search_results = vector_store.similarity_search_by_vector(query_vector, k=5)

            return True, search_results
        
        except Exception as e:
            warnings.warn(f"Error in retrieve_docs_based_on_chosen_topics: {e}")
            return False, e
