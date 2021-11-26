import { GetServerSideProps } from 'next'
import { FilmsDocument, FilmsQuery, FilmsQueryVariables, useFilmsQuery } from '../graphql/generated'
import { merge } from '../src/merge'
import styles from '../styles/home.module.css'
import { createApolloClient } from '../utils/apollo'

export default function Server() {
  const { data } = useFilmsQuery()
  const films = data?.allFilms?.films
  return <div className={styles.grid}>
    {
      films?.map((film, index) => {
        return <div key={film?.episodeID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className={styles.title} style={{ marginBottom: '10px' }}>{film.title}</h1>
          <div>Director: {film?.director}</div>
        </div>
      })
    }
  </div>
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = createApolloClient()
  const { data } = await client.query<FilmsQuery, FilmsQueryVariables>({
    query: FilmsDocument
  })

  return merge(client, {
    props: {
      data
    }
  })
}