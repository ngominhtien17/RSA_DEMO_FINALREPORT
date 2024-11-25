document.addEventListener('DOMContentLoaded', () => {
    // Xử lý sự kiện nhấn nút "Đăng ký"
    document.getElementById('registerButton').addEventListener('click', async () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!name || !email || !password) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại!');
        }
    });
});
