import Link from "next/link";

type Tool = { href: string; name: string; group: string };

const TOOLS: Tool[] = [
  { href: "/tinh-phan-tram", name: "% của một giá trị", group: "Cơ bản" },
  { href: "/phan-tram-tang-giam", name: "% tăng giảm", group: "Cơ bản" },
  { href: "/tinh-tang-giam-theo-phan-tram", name: "Tăng/giảm theo %", group: "Cơ bản" },
  { href: "/tim-gia-tri-goc", name: "Tìm giá trị gốc khi biết %", group: "Cơ bản" },
  { href: "/bao-nhieu-phan-tram", name: "A là bao nhiêu % của B", group: "Cơ bản" },
  { href: "/lai-suat-don", name: "Lãi suất đơn", group: "Tài chính" },
  { href: "/lai-kep", name: "Lãi kép (compound)", group: "Tài chính" },
  { href: "/so-sanh-tiet-kiem", name: "So sánh lãi tiết kiệm 26 ngân hàng", group: "Tài chính" },
  { href: "/so-sanh-vay", name: "So sánh lãi vay mua nhà", group: "Tài chính" },
  { href: "/tinh-giam-gia", name: "Tính giảm giá khi mua sắm", group: "Mua sắm" },
  { href: "/so-sanh-gia", name: "So sánh giá nhiều cửa hàng", group: "Mua sắm" },
  { href: "/chia-bill-tip", name: "Chia bill & tip", group: "Mua sắm" },
  { href: "/soi-sale", name: "Soi sale — phát hiện sale ảo", group: "Mua sắm" },
  { href: "/luong-net", name: "Lương net từ gross (TNCN 2026)", group: "Tiện ích" },
  { href: "/bmi", name: "BMI & % giảm cân", group: "Tiện ích" },
  { href: "/phan-tram-thoi-gian", name: "% thời gian trôi qua", group: "Thời gian" },
  { href: "/break-even", name: "Break-even — % bù lỗ", group: "Đặc biệt" },
];

const GROUP_ORDER = ["Cơ bản", "Tài chính", "Mua sắm", "Tiện ích", "Thời gian", "Đặc biệt"];

export default function HomeSEOContent() {
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: TOOLS.filter((t) => t.group === g),
  }));

  return (
    <article className="seo-content max-w-5xl mx-auto px-4 py-8" aria-label="Nội dung giới thiệu 1phantram.com">
      <h1>Máy Tính Phần Trăm Online — Nhanh, Miễn Phí, Tối Ưu Mobile</h1>
      <p>
        <strong>1phantram.com</strong> là bộ <strong>17 công cụ tính phần trăm chuyên biệt</strong> dành riêng cho
        người Việt: từ tính % cơ bản, % tăng giảm, giảm giá, lãi suất ngân hàng đến lương net sau thuế TNCN 2026.
        Toàn bộ 100% <strong>miễn phí</strong>, <strong>không quảng cáo</strong>, tính toán client-side ngay trên
        trình duyệt nên tốc độ phản hồi gần như tức thì. Trang được tối ưu mobile-first, có lưu lịch sử, share kết
        quả qua link/QR, hỗ trợ <Link href="/ai">AI parser hiểu tiếng Việt</Link> tự nhiên và{" "}
        <Link href="/widget-embed">widget embed iframe</Link> để bạn nhúng vào website cá nhân.
      </p>

      <h2 id="cong-cu">17 Công Cụ Tính Phần Trăm Chuyên Biệt</h2>
      <p>
        Mỗi công cụ là một trang riêng với metadata, ví dụ và FAQ đầy đủ, giúp bạn truy cập đúng phép tính cần thiết
        chỉ trong một cú click. Danh sách được gom theo 6 nhóm:
      </p>
      <ul>
        {grouped.map(({ group, items }) => (
          <li key={group}>
            <strong>{group} ({items.length}):</strong>{" "}
            {items.map((t, i) => (
              <span key={t.href}>
                <Link href={t.href}>{t.name}</Link>
                {i < items.length - 1 ? ", " : ""}
              </span>
            ))}
          </li>
        ))}
      </ul>
      <p>
        Bạn cũng có thể dùng <Link href="/so-sanh-tinh-toan">trang so sánh phép tính</Link> để đặt 2–4 công cụ cạnh
        nhau và xem chênh lệch tức thì — cực kỳ tiện khi cân nhắc 2 phương án vay, 2 deal sale hoặc 2 mức lương.
      </p>

      <h2 id="moi">🆕 5 Tính Năng Mới Tháng 6/2026</h2>
      <p>
        Tháng 6/2026, 1phantram.com phát hành 5 tính năng lớn để phục vụ nhu cầu thực tế của người dùng Việt:
      </p>
      <ul>
        <li>
          <Link href="/so-sanh-tinh-toan">🆕 So sánh phép tính side-by-side</Link> — đặt nhiều phép tính cạnh nhau,
          theo dõi chênh lệch real-time, lý tưởng để so sánh kịch bản đầu tư.
        </li>
        <li>
          <Link href="/ai">🤖 Máy tính phần trăm AI hiểu tiếng Việt</Link> — gõ tự nhiên kiểu “30% của 200 nghìn là
          bao nhiêu”, AI tự bóc tách số và phép tính.
        </li>
        <li>
          <Link href="/widget-embed">🧩 Widget embed iframe miễn phí</Link> — nhúng máy tính vào blog WordPress, web
          công ty hoặc landing page chỉ với một dòng iframe.
        </li>
        <li>
          <Link href="/so-sanh-tiet-kiem">💰 So sánh lãi suất tiết kiệm 26 ngân hàng</Link> — dataset cập nhật, lọc
          theo kỳ hạn, kênh online/quầy.
        </li>
        <li>
          <Link href="/so-sanh-vay">🏠 So sánh lãi suất vay mua nhà</Link> — đặc biệt cảnh báo bẫy lãi mồi: ngân
          hàng quảng cáo 5,5%/năm nhưng sau ưu đãi nhảy lên 12–13%, công cụ tính chi phí thực sau toàn vòng đời
          khoản vay.
        </li>
      </ul>

      <h2 id="tai-sao">Tại Sao Chọn 1phantram.com?</h2>
      <ul>
        <li>⚡ <strong>Tính ngay không cần Enter</strong> — debounce 100ms, kết quả hiện liền khi gõ số.</li>
        <li>📱 <strong>Tối ưu mobile-first</strong> — hơn 60% người dùng truy cập từ điện thoại, layout & font-size cân chỉnh kỹ.</li>
        <li>🆓 <strong>100% miễn phí, không quảng cáo</strong> — không banner, không popup, không trial.</li>
        <li>🔒 <strong>Tính toán client-side</strong> — số liệu không rời khỏi trình duyệt của bạn, không gửi về server.</li>
        <li>🌙 <strong>Dark mode tự động</strong> — theo cài đặt hệ thống hoặc tùy chỉnh trong app.</li>
        <li>💾 <strong>Lưu lịch sử + share kết quả</strong> — gửi link/QR cho bạn bè hoặc lưu lại để xem lại sau.</li>
      </ul>

      <h2 id="loai-tinh">Các Loại Tính Phần Trăm Phổ Biến</h2>
      <p>
        Dưới đây là 6 dạng tính % được tra cứu nhiều nhất tại Việt Nam, kèm công thức ngắn gọn để bạn nắm nhanh
        bản chất phép toán trước khi dùng công cụ:
      </p>
      <ul>
        <li>
          <strong>% của giá trị</strong> — Công thức: <code>A × P / 100</code>. Ví dụ 30% của 200.000đ = 60.000đ.
          Dùng <Link href="/tinh-phan-tram">công cụ tính % của một giá trị</Link>.
        </li>
        <li>
          <strong>% tăng/giảm</strong> — Công thức: <code>(mới − cũ) / cũ × 100</code>. Áp dụng cho so sánh doanh
          thu, giá cổ phiếu, cân nặng. Xem <Link href="/phan-tram-tang-giam">tính % tăng giảm</Link>.
        </li>
        <li>
          <strong>Giảm giá</strong> — Công thức: <code>Giá × (1 − %/100)</code>. Ví dụ giảm 25% giá 800.000đ còn
          600.000đ. Dùng <Link href="/tinh-giam-gia">tính giảm giá</Link> hoặc{" "}
          <Link href="/soi-sale">soi sale</Link> để phát hiện sale ảo.
        </li>
        <li>
          <strong>Lãi kép</strong> — Công thức: <code>P × (1 + r/n)^(n·t)</code>. Lãi nhập gốc theo chu kỳ, cực
          quan trọng khi gửi tiết kiệm dài hạn hoặc đầu tư DCA. Xem <Link href="/lai-kep">tính lãi kép</Link>.
        </li>
        <li>
          <strong>Break-even (% bù lỗ)</strong> — Công thức: <code>1 / (1 − loss%) − 1</code>. Khi lỗ 20%, cần
          tăng 25% để hoà vốn — sai số tâm lý phổ biến. Dùng <Link href="/break-even">tính break-even</Link>.
        </li>
        <li>
          <strong>Lương net từ gross</strong> — Trừ BHXH/BHYT/BHTN + thuế TNCN lũy tiến từng bậc theo biểu thuế
          2026. Xem <Link href="/luong-net">tính lương net 2026</Link>.
        </li>
      </ul>

      <h2 id="blog">Tích Hợp Blog 1phantram.com</h2>
      <p>
        Bên cạnh bộ công cụ tính toán, blog <a href="https://1phantram.com/blog/" rel="noopener"><strong>1phantram.com/blog</strong></a>{" "}
        có hơn <strong>30 bài kiến thức</strong> về tài chính cá nhân, lãi suất ngân hàng, công thức %, đầu tư và
        case-study thực tế — được xuất bản và cập nhật hằng tuần. Danh sách bài viết mới nhất hiển thị ngay phía
        dưới (tự động đồng bộ từ blog).
      </p>

      <h2 id="faq">Câu Hỏi Thường Gặp</h2>
      <details>
        <summary>Cách tính 30% của 200.000đ?</summary>
        <p>
          Lấy 200.000 × 30 ÷ 100 = <strong>60.000đ</strong>. Hoặc dùng{" "}
          <Link href="/tinh-phan-tram">công cụ tính % của một giá trị</Link> để nhập số và xem kết quả tức thì.
        </p>
      </details>
      <details>
        <summary>Phần trăm tăng giảm tính sao?</summary>
        <p>
          Công thức: <code>(giá trị mới − giá trị cũ) / giá trị cũ × 100</code>. Kết quả dương là tăng, âm là giảm.
          Ví dụ: doanh thu từ 80 triệu lên 100 triệu = (100 − 80)/80 × 100 = 25% tăng.
        </p>
      </details>
      <details>
        <summary>Lãi kép khác lãi đơn ở đâu?</summary>
        <p>
          <strong>Lãi đơn</strong> chỉ tính trên gốc ban đầu. <strong>Lãi kép</strong> nhập lãi vào gốc cuối mỗi
          chu kỳ, vì vậy chu kỳ sau lãi được tính trên cả gốc lẫn lãi cũ — số tiền tăng theo cấp số mũ. So sánh
          trực tiếp tại <Link href="/lai-suat-don">lãi đơn</Link> và <Link href="/lai-kep">lãi kép</Link>.
        </p>
      </details>
      <details>
        <summary>1phantram.com có thu thập dữ liệu cá nhân không?</summary>
        <p>
          Không. Mọi phép tính chạy hoàn toàn trên trình duyệt của bạn (client-side), số liệu không gửi về server.
          Chúng tôi chỉ dùng Google Analytics để đếm lượng truy cập ẩn danh phục vụ thống kê.
        </p>
      </details>
      <details>
        <summary>Có thể nhúng máy tính vào website của mình không?</summary>
        <p>
          Có. Truy cập <Link href="/widget-embed">trang widget embed</Link> để lấy đoạn iframe HTML. Nhúng vào
          WordPress, Blogger, landing page hoặc bất kỳ trang nào hỗ trợ HTML — miễn phí, không cần API key.
        </p>
      </details>
      <details>
        <summary>Máy tính AI hiểu được câu nói thường ngày không?</summary>
        <p>
          Được. <Link href="/ai">Máy tính AI</Link> hiểu các cách diễn đạt Việt như “30% của 200 nghìn”, “tăng
          15% so với 1 triệu”, “sale 20% còn bao nhiêu của 850k”. Bạn không cần học cú pháp.
        </p>
      </details>
      <details>
        <summary>Lãi suất ngân hàng trên trang có cập nhật không?</summary>
        <p>
          Có. Dataset của <Link href="/so-sanh-tiet-kiem">so sánh tiết kiệm</Link> và{" "}
          <Link href="/so-sanh-vay">so sánh vay mua nhà</Link> được rà soát định kỳ theo biểu lãi suất công bố của
          các ngân hàng. Tuy nhiên đây là tham khảo — hãy gọi tổng đài ngân hàng để xác nhận trước khi quyết định.
        </p>
      </details>

      <h2 id="cap-nhat">Cập Nhật Mới Nhất</h2>
      <p>
        <strong>Tháng 6/2026:</strong> ra mắt 5 tính năng lớn (so sánh phép tính, AI parser, widget embed, so sánh
        lãi tiết kiệm 26 ngân hàng, so sánh lãi vay mua nhà với cảnh báo bẫy lãi mồi). Dataset lãi suất ngân hàng
        và biểu thuế <strong>TNCN 2026</strong> được cập nhật mới nhất, áp dụng cho công cụ{" "}
        <Link href="/luong-net">tính lương net</Link>.
      </p>
    </article>
  );
}
