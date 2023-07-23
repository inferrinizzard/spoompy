import Link from 'next/link';
import { Text } from '@kuma-ui/core';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <article>
        <Link href="/browse">
          <Text fontSize={48}>{'Browse'}</Text>
        </Link>
      </article>
      <article>
        <Link href="/analysis">
          <Text fontSize={48}>{'Analysis'}</Text>
        </Link>
      </article>
      <article>
        <Link href="/archive">
          <Text fontSize={48}>{'Archive'}</Text>
        </Link>
      </article>
      <article>
        <h1>{'Misc'}</h1>
      </article>
    </main>
  );
}
