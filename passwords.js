// Cấu hình danh sách mật khẩu hợp lệ
// Bạn có thể dùng 1 trong 2 cách (hoặc cả 2 cùng lúc):
// Cách 1: Danh sách mật khẩu dạng chữ thông thường (Đơn giản, dễ thêm)
// Cách 2: Danh sách mã hash SHA-256 (Bảo mật cao hơn, người khác F12/view source không thấy pass thật)

const CONFIG = {
  // Repo GitHub của bạn để tự động quét file:
  githubRepo: "BeeAuto/DeployBeeAuto",

  // Danh sách mật khẩu dạng thường (Plaintext)
  // Chỉ cần đúng 1 trong các mật khẩu này là vào được
  allowedPasswords: [
    //Bang
    "2075877456",//2026-11-21
    "237503653",//2026-11-25
	"492596129",//2027-04-24
	//Tộc
    "2352501460",//2026-12-27
	"4159379845",//2027-04-24
	//Máy
	"a9bc607a",//2026-12-31
	"2d98456a",//2027-04-11
	"d40139cd",//2027-12-31
	"fa8e018d",//2027-12-31
	"6274d32e"//2027-10-20
  ],

  // Danh sách mã băm SHA-256 tương ứng (Tùy chọn thêm để tăng bảo mật)
  // Ví dụ dưới đây là SHA-256 của: "adminpass" và "github2026"
  allowedHashes: [
    "7139798771d20ec0e0ce910f7908d192737e5b6772668f142c23f1f2a7516631", // sha256 của "adminpass"
    "4d01b1b17b36a14749f7aa281e695d3153406322ad1943d68ef211e2f7b8d4f4"  // sha256 của "github2026"
  ]
};
