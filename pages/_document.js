import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Opcional: agrega favicon, meta tags, etc */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+6vlt5Xp9G5vpa/0p1hF9s+uwR5yP"
          crossOrigin="anonymous"
        ></script>
      </body>
    </Html>
  );
}
