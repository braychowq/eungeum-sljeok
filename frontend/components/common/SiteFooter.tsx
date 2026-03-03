import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="사이트 푸터">
      <div className={styles.brandRow}>
        <strong>은금슬쩍</strong>
      </div>

      <address className={styles.companyInfo}>
        <p>대표 메일 : sample@naver.com</p>
        <p>주소 : 경기도 화성시</p>
      </address>

      <p className={styles.copyright}>
        Copyright © 2026 eungeum-sljuck Co.,Ltd. All rights reserved.
      </p>
    </footer>
  );
}
