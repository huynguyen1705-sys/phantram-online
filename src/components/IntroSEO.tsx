export default function IntroSEO() {
  return (
    <div style={{ background: "var(--bg)" }} className="px-4 py-6">
      <div className="max-w-5xl mx-auto">
      <article
        className="rounded-2xl border p-5 prose-content"
        style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
      >
        <h2 className="text-xl font-bold mb-3 leading-tight">
          Tính phần trăm online miễn phí, nhanh trên mobile
        </h2>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text)" }}>
          <strong>1phantram.com</strong> là công cụ <strong>tính phần trăm</strong> online miễn phí,
          tối ưu cho mobile, không cần đăng ký. Hỗ trợ đầy đủ các phép tính từ cơ bản
          đến nâng cao: tính % của một giá trị, % tăng giảm, % giảm giá khi mua sắm,
          lãi suất ngân hàng đơn và kép, ROI đầu tư, và tỷ lệ phần trăm trong thống kê.
        </p>

        <h2 className="text-base font-bold mt-5 mb-2">Tính năng nổi bật</h2>
        <ul className="text-sm leading-relaxed space-y-1.5 ml-4 list-disc">
          <li>Tính phần trăm của một số bất kỳ — ví dụ 30% của 200.000đ</li>
          <li>Tính phần trăm tăng giảm giữa hai giá trị</li>
          <li>Tính % giảm giá khi mua sắm — biết giá gốc và giá sale</li>
          <li>Tính lãi suất ngân hàng (đơn và kép) theo công thức chuẩn</li>
          <li>Tính ROI đầu tư, tỷ suất sinh lời CAGR</li>
          <li>Lưu lịch sử tính toán, dark mode, dùng được offline</li>
        </ul>

        <h2 className="text-base font-bold mt-5 mb-2">Các công thức tính phần trăm cần biết</h2>
        <div className="text-sm leading-relaxed space-y-2.5">
          <div>
            <strong>Tính % của một số:</strong> Kết quả = (Số gốc × % cần tính) ÷ 100.
            <br />
            <em style={{ color: "var(--text-muted)" }}>
              Ví dụ: 25% của 800 = 800 × 25 ÷ 100 = 200
            </em>
          </div>
          <div>
            <strong>% tăng giảm:</strong> % thay đổi = (Mới − Cũ) ÷ Cũ × 100.
            <br />
            <em style={{ color: "var(--text-muted)" }}>
              Ví dụ: Lương tăng từ 10 lên 12 triệu → tăng 20%
            </em>
          </div>
          <div>
            <strong>Giá sau giảm:</strong> Giá mới = Giá gốc × (100 − % giảm) ÷ 100.
            <br />
            <em style={{ color: "var(--text-muted)" }}>
              Ví dụ: Giảm 30% giá 500.000đ → còn 350.000đ
            </em>
          </div>
          <div>
            <strong>Lãi kép:</strong> Số tiền cuối = Vốn × (1 + lãi suất)<sup>số kỳ</sup>.
            <br />
            <em style={{ color: "var(--text-muted)" }}>
              Ví dụ: 100tr lãi 7%/năm sau 10 năm = 196.7 triệu
            </em>
          </div>
        </div>

        <h2 className="text-base font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
        <div className="text-sm leading-relaxed space-y-3">
          <details className="cursor-pointer">
            <summary className="font-semibold">
              Tính phần trăm trên 1phantram.com có miễn phí không?
            </summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Có. Hoàn toàn miễn phí, không quảng cáo, không cần đăng ký, không thu thập dữ liệu cá nhân.
              Hoạt động trên mọi thiết bị di động và máy tính.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Có cần kết nối internet để dùng không?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Chỉ cần internet để tải lần đầu. Sau đó công cụ có thể hoạt động offline (PWA).
              Phép tính chạy ngay trên trình duyệt, không gửi dữ liệu lên server.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Khác gì với máy tính phần trăm trên điện thoại?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              1phantram.com có nhiều chế độ chuyên dụng: tính giảm giá, lãi suất, ROI, lãi kép —
              các phép tính phức tạp mà máy tính mặc định không có. Lịch sử cũng được lưu tự động.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Lỗ 20% cần lãi bao nhiêu % để hòa vốn?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Cần tăng 25%. Công thức: % bù = lỗ% ÷ (100 − lỗ%) × 100. Lỗ càng lớn cần tăng càng nhiều:
              lỗ 50% cần lãi 100% mới hòa.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Cách scale công thức nấu ăn cho nhiều người hơn?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Dùng hệ số tỉ lệ = số người mới / số người gốc. Ví dụ công thức cho 4 người muốn nấu cho 7 người: hệ số 1.75.
              Nhân hệ số này với mọi nguyên liệu. Với nguyên liệu đơn vị nguyên (quả trứng, củ hành) nên làm tròn lên.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">BMI bao nhiêu là bình thường với người Việt?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Theo chuẩn WHO Asia-Pacific (áp dụng cho người châu Á): BMI 18.5–22.9 là bình thường, 23–24.9 là thừa cân, ≥25 là béo phì độ I.
              Khác với chuẩn toàn cầu (25 mới thừa cân) vì người châu Á có nguy cơ tim mạch cao hơn ở mức BMI thấp hơn.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Giảm bao nhiêu % cân nặng mỗi tháng là an toàn?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              An toàn nhất là 0.5–1 kg/tuần (~2–4 kg/tháng, tương đương 0.5–1% cân nặng/tuần). Giảm nhanh hơn 1 kg/tuần dễ mất cơ, ảnh hưởng trao đổi chất.
              Tổng cộng nên giảm tối đa 5–10% trong 6 tháng để duy trì lâu dài.
            </p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-semibold">Học cách tính phần trăm ở đâu?</summary>
            <p className="mt-1.5 ml-1" style={{ color: "var(--text-muted)" }}>
              Xem chi tiết tại{" "}
              <a
                href="https://1phantram.com/blog/"
                className="font-semibold underline"
                style={{ color: "var(--primary)" }}
              >
                blog 1phantram.com
              </a>{" "}
              — 28+ bài hướng dẫn từ cơ bản đến tài chính cá nhân, lãi kép, ROI, CAGR.
            </p>
          </details>
        </div>

        <p
          className="text-xs mt-5 pt-4 border-t"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
        >
          1phantram.com — Công cụ tính phần trăm online miễn phí, phát triển bởi đội ngũ
          người Việt, tối ưu cho mobile-first. Mọi phép tính đều dùng công thức toán học
          chuẩn quốc tế.
        </p>
      </article>
      </div>
    </div>
  );
}
