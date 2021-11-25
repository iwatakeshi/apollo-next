import Head from 'next/head'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>apollo-next</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to apollo-next!</h1>

        <p className={styles.description}>
          This project was scaffolded by{' '}
          <a href="https://github.com/prismify-co/ko" className={styles.link}>
            <strong>ko</strong>
          </a>
          .
          <br />
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code> or start
          configuring your project{' '}
          <code className={styles.code}>
            <strong>ko</strong> <strong>install</strong> <strong>chakra</strong>
          </code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <div className={styles.logo}>
            <svg
              height="100%"
              viewBox="0 0 284 65"
              fill="#000"
              arial-label="Vercel Logo"
            >
              <path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"></path>
            </svg>
          </div>
        </a>

        <a
          href="https://prismify.co?utm_source=ko&utm_campaign=ko"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '15px' }}
        >
          Made by{' '}
          <div className={styles.logo}>
            <svg width="75" height="20" viewBox="0 0 75 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="white" stroke="black"/>
              <path d="M2.30065 14.7L8.80783 3.01364L15.555 14.7H2.30065Z" stroke="black"/>
              <path d="M4.17389 14.7L10.9289 3L17.6839 14.7H4.17389Z" stroke="black"/>
              <path d="M26.0615 11.4077V16H24.355V4.69141H26.2886C27.2358 4.69141 27.9512 4.75732 28.4346 4.88916C28.9229 5.021 29.3525 5.27002 29.7236 5.63623C30.373 6.271 30.6978 7.07178 30.6978 8.03857C30.6978 9.07373 30.3511 9.89404 29.6577 10.4995C28.9644 11.105 28.0293 11.4077 26.8525 11.4077H26.0615ZM26.0615 9.82568H26.6987C28.2661 9.82568 29.0498 9.22266 29.0498 8.0166C29.0498 6.84961 28.2417 6.26611 26.6255 6.26611H26.0615V9.82568ZM32.1406 8.86621H33.7886V9.50342C34.0913 9.18604 34.3599 8.96875 34.5942 8.85156C34.8335 8.72949 35.1167 8.66846 35.4438 8.66846C35.8784 8.66846 36.3325 8.81006 36.8062 9.09326L36.0518 10.6021C35.7393 10.3774 35.4341 10.2651 35.1362 10.2651C34.2378 10.2651 33.7886 10.9438 33.7886 12.3013V16H32.1406V8.86621ZM39.6333 8.86621V16H37.9854V8.86621H39.6333ZM37.7363 5.8999C37.7363 5.61182 37.8413 5.36279 38.0513 5.15283C38.2612 4.94287 38.5127 4.83789 38.8057 4.83789C39.1035 4.83789 39.3574 4.94287 39.5674 5.15283C39.7773 5.35791 39.8823 5.60937 39.8823 5.90723C39.8823 6.20508 39.7773 6.45898 39.5674 6.66895C39.3623 6.87891 39.1108 6.98389 38.813 6.98389C38.5151 6.98389 38.2612 6.87891 38.0513 6.66895C37.8413 6.45898 37.7363 6.20264 37.7363 5.8999ZM45.8662 10.082L44.5039 10.8071C44.2891 10.3677 44.0229 10.1479 43.7056 10.1479C43.5542 10.1479 43.4248 10.1992 43.3174 10.3018C43.21 10.3994 43.1562 10.5264 43.1562 10.6826C43.1562 10.9561 43.4736 11.2271 44.1084 11.4956C44.9824 11.8716 45.5708 12.2183 45.8735 12.5356C46.1763 12.853 46.3276 13.2803 46.3276 13.8174C46.3276 14.5059 46.0737 15.082 45.5659 15.5459C45.0728 15.9854 44.4771 16.2051 43.7788 16.2051C42.5825 16.2051 41.7354 15.6216 41.2373 14.4546L42.6436 13.8027C42.8389 14.1445 42.9878 14.3618 43.0903 14.4546C43.2905 14.6401 43.5298 14.7329 43.8081 14.7329C44.3647 14.7329 44.6431 14.479 44.6431 13.9712C44.6431 13.6782 44.4282 13.4048 43.9985 13.1509C43.8325 13.0679 43.6665 12.9873 43.5005 12.9092C43.3345 12.8311 43.166 12.7505 42.9951 12.6675C42.5166 12.4331 42.1797 12.1987 41.9844 11.9644C41.7354 11.6665 41.6108 11.2832 41.6108 10.8145C41.6108 10.1943 41.8232 9.68164 42.248 9.27637C42.6826 8.87109 43.21 8.66846 43.8301 8.66846C44.7432 8.66846 45.4219 9.13965 45.8662 10.082ZM47.8145 8.86621H49.4624V9.52539C49.7798 9.19336 50.0508 8.96875 50.2754 8.85156C50.5146 8.72949 50.8149 8.66846 51.1763 8.66846C51.9819 8.66846 52.6191 9.02002 53.0879 9.72314C53.6055 9.02002 54.3062 8.66846 55.1899 8.66846C56.7964 8.66846 57.5996 9.64258 57.5996 11.5908V16H55.9443V12.0376C55.9443 11.354 55.8613 10.8706 55.6953 10.5874C55.5244 10.2993 55.2437 10.1553 54.853 10.1553C54.3989 10.1553 54.0669 10.3262 53.8569 10.668C53.6519 11.0098 53.5493 11.5591 53.5493 12.3159V16H51.894V12.0596C51.894 10.79 51.5278 10.1553 50.7954 10.1553C50.3315 10.1553 49.9922 10.3286 49.7773 10.6753C49.5674 11.022 49.4624 11.5688 49.4624 12.3159V16H47.8145V8.86621ZM61.3276 8.86621V16H59.6797V8.86621H61.3276ZM59.4307 5.8999C59.4307 5.61182 59.5356 5.36279 59.7456 5.15283C59.9556 4.94287 60.207 4.83789 60.5 4.83789C60.7979 4.83789 61.0518 4.94287 61.2617 5.15283C61.4717 5.35791 61.5767 5.60937 61.5767 5.90723C61.5767 6.20508 61.4717 6.45898 61.2617 6.66895C61.0566 6.87891 60.8052 6.98389 60.5073 6.98389C60.2095 6.98389 59.9556 6.87891 59.7456 6.66895C59.5356 6.45898 59.4307 6.20264 59.4307 5.8999ZM65.1216 10.4043V16H63.4663V10.4043H62.8804V8.86621H63.4663V6.1123C63.4663 5.21387 63.6226 4.5791 63.9351 4.20801C64.3647 3.69043 64.9897 3.43164 65.8101 3.43164C66.103 3.43164 66.4717 3.51709 66.916 3.68799V5.37256L66.7476 5.28467C66.3911 5.104 66.0981 5.01367 65.8687 5.01367C65.5757 5.01367 65.3779 5.11865 65.2754 5.32861C65.1729 5.53369 65.1216 5.9292 65.1216 6.51514V8.86621H66.916V10.4043H65.1216ZM70.1167 14.6743L66.9087 8.86621H68.8203L71.0029 12.9678L73.0391 8.86621H74.8994L69.2158 19.8818H67.3335L70.1167 14.6743Z" fill="black"/>
            </svg>

          </div>
        </a>

      </footer>
    </div>
  )
}
