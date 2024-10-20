import os
import warnings

from langchain_openai import OpenAIEmbeddings
from sklearn.feature_extraction.text import TfidfVectorizer

import singlestoredb as s2
from langchain_community.vectorstores import SingleStoreDB
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_core.documents import Document

class DB:
    conn = None
    def __init__(self):

        # Retrieve Embeddings
        self.embeddings = OpenAIEmbeddings()

        # Connect to the database
        self.connect_db()

    def connect_db(self):
        self.conn = s2.connect(os.environ['SINGLESTORE'])

    def add_record(self,user_id,session_id,doc):

        try:
            self.conn = s2.connect(os.environ['SINGLESTORE'])
            with self.conn:
                with self.conn.cursor() as cur:
                    q_string = "INSERT INTO calhacks.SESSION (user_id, session_id, doc) VALUES (%s, %s, %s)"
                    cur.execute(q_string, (user_id, session_id, doc))
        
        except Exception as e:
            warnings.warn(f"Error in add_record: {e}")
            return False, e

        else:
            return True, "Record added successfully"

    def retrieve_top_k_topics(self,session_id='1'):
        try:
            self.conn = s2.connect(os.environ['SINGLESTORE'])
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
            
    def retrieve_docs(self,session_id='1'):
        try:
            self.conn = s2.connect(os.environ['SINGLESTORE'])
            with self.conn:
                with self.conn.cursor() as cur:
                    q_string = "SELECT doc FROM calhacks.SESSION WHERE session_id = %s"
                    cur.execute(q_string, (session_id,))

                    # Retrieve the documents
                    docs = cur.fetchall()

            return True, [doc[0] for doc in docs]
        
        except Exception as e:
            warnings.warn(f"Error in retrieve_docs: {e}")
            return False, e

    def retrieve_top_k_unique_keywords(self, docs, K=5):
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([doc[0] for doc in docs]).toarray()
        top_k_keywords = tfidf_matrix.argsort()[:K].flatten()
        return [vectorizer.get_feature_names_out()[i] for i in top_k_keywords]
    
    def retrieve_docs_based_on_chosen_topics(self, session_id,search_string):
        self.conn = s2.connect(os.environ['SINGLESTORE'])
        with self.conn:
            with self.conn.cursor() as cur:
                q_string = "SELECT doc FROM calhacks.SESSION WHERE session_id = %s"
                cur.execute(q_string, (session_id,))

                # Retrieve the documents
                docs = cur.fetchall()

        docs = [Document(page_content=doc[0]) for doc in docs]
        docsearch = SingleStoreDB.from_documents(
            docs,
            self.embeddings,
            distance_strategy=DistanceStrategy.DOT_PRODUCT, 
            use_vector_index=True,
            use_full_text_search=True,
            table_name="SESSION_vectorstore", 
        )

        textResults = docsearch.similarity_search(
            search_string,
            k=1,
            search_strategy=SingleStoreDB.SearchStrategy.TEXT_ONLY,
        )
        return True, [page.page_content for page in textResults]