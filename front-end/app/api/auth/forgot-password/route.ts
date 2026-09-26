import { NextRequest, NextResponse } from 'next/server';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Используем стандартную WordPress форму восстановления пароля
    // (wp-login.php?action=lostpassword) через POST
    const wpLostPasswordUrl = `${WP_URL}/wp-login.php?action=lostpassword`;

    // Параметры: user_login — email или логин
    const formData = new URLSearchParams();
    formData.append('user_login', email);
    formData.append('redirect_to', `${WP_URL}/wp-login.php?checkemail=confirm`);

    const res = await fetch(wpLostPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    // Если статус 200, WordPress отправил письмо со ссылкой на сброс
    if (res.ok) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    } else {
      // Даже если пользователь не найден, WP может вернуть 200, но с ошибкой в теле.
      // Мы всё равно возвращаем общее сообщение (не раскрываем существование email)
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}