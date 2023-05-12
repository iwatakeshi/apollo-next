import { GetStaticProps } from "next";
import {
  FilmsDocument,
  FilmsQuery,
  FilmsQueryVariables,
  useFilmsQuery,
} from "../graphql/generated";
import styles from "../styles/home.module.css";
import { createApolloClient } from "../utils/client.apollo";
import { withApollo } from "../src";
import Link from "next/link";
export default function Static() {
  const { data } = useFilmsQuery();
  const films = data?.allFilms?.films;
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.link}>
        Home
      </Link>
      <div className={styles.grid}>
        {films?.map((film, index) => {
          return (
            <div
              key={film?.episodeID || index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 className={styles.title} style={{ marginBottom: "10px" }}>
                {film.title}
              </h1>
              <div>Director: {film?.director}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const getStaticProps = withApollo<GetStaticProps>(
  () => createApolloClient(),
  async ({ client }) => {
    console.log(client)
    const { data } = await client.query<FilmsQuery, FilmsQueryVariables>({
      query: FilmsDocument,
    });
    return {
      props: {
        data,
      },
      revalidate: 60,
    };
  }
);
