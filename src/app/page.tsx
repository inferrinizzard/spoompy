import Link from 'next/link';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <article>
        <Link href="/browse">
          <h1>{'Browse'}</h1>
        </Link>
      </article>
      <article>
        <Link href="/analysis">
          <h1>{'Analysis'}</h1>
        </Link>
      </article>
      <article>
        <Link href="/archive">
          <h1>{'Archive'}</h1>
        </Link>
      </article>
      <article>
        <h1>{'Misc'}</h1>
      </article>
    </main>
  );
}
