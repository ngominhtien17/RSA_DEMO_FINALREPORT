document.addEventListener('DOMContentLoaded', () => {
    // Xử lý sự kiện nhấn nút "Đăng nhập"
    document.getElementById('loginButton').addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Vô hiệu hóa nút để ngăn chặn nhiều lần nhấn
        const loginButton = document.getElementById('loginButton');
        loginButton.disabled = true;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Đảm bảo cookie session được gửi cùng yêu cầu
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng nhập thành công!');
                window.location.href = '/'; // Chuyển về trang chủ sau khi đăng nhập
            } else {
                alert('Lỗi: ' + (data.message || 'Đăng nhập thất bại'));
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại!');
        } finally {
            // Kích hoạt lại nút sau khi xử lý xong
            loginButton.disabled = false;
        }
    });
});
