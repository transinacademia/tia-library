import Link from 'next/link'

export default function Home() {
  return (
    <main className="landing">
      <img className="landing-logo theme-logo-light" src="/LOGO.webp" alt="Trans in Academia!" />
      <img className="landing-logo theme-logo-dark" src="/LOGO_Dark.webp" alt="" aria-hidden="true" />
      <p className="eyebrow">Trans in Academia!</p>
      <h1>跨性别学术小组资料库</h1>
      <p className="lead">这里收录跨性别学术小组的写作、翻译与研究资料，欢迎阅读、引用和分享。</p>
      <div className="landing-actions">
        <Link className="button" href="/zh/docs">浏览资料库</Link>
        <a className="button button-secondary" href="https://transinacademia.org/" target="_blank" rel="noreferrer">
          访问小组主页
        </a>
      </div>
      <section className="landing-section" aria-labelledby="submission-heading">
        <h2 id="submission-heading">投稿与参与</h2>
        <p>
          如果您有意投稿，请将作品发送至{' '}
          <a href="mailto:tia@proton.me">tia@proton.me</a>，并附上联系方式、作品出处和转载格式等信息。
          审核通过后，我们会尽快与您联系，并将作品上传至资料库的对应板块。
        </p>
        <p><Link href="/zh/docs/about">了解更多关于我们</Link></p>
      </section>
    </main>
  );
}
