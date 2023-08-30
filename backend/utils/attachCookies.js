export const attachCookies = (res, token) => {
    const oneDay = 1000 * 60 * 60 * 24

    return res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })
}
