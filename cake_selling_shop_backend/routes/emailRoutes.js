const express = require('express');
const axios = require('axios');
const router = express.Router();

let verificationCode = '';

router.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code

    const formData = new URLSearchParams();
    formData.append('service_id', 'service_f8pe2cl');
    formData.append('template_id', 'template_gxhq4rm');
    formData.append('user_id', 'HXGYG1VBulNzebI2B');
    formData.append('accessToken', 'DT7lSHtH6iXTI6xS0qd5F');
    formData.append('email', email);
    formData.append('verification_code', verificationCode);

    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send-form', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.status(200).send('Verification code sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }
});

router.post('/verify-code', (req, res) => {
    const { code } = req.body;
    if (code === verificationCode) {
        res.status(200).send('Code verified');
    } else {
        res.status(400).send('Invalid code');
    }
});

router.post('/send-status-order', async (req, res) => {
    const { order_id, total_amount, shipping_address, status, update_at } = req.body;

    const formData = new URLSearchParams();
    formData.append('service_id', 'service_f8pe2cl');
    formData.append('template_id', 'template_9oorry7');
    formData.append('user_id', 'HXGYG1VBulNzebI2B');
    formData.append('accessToken', 'DT7lSHtH6iXTI6xS0qd5F');
    formData.append('status', status === 'completed' ? 'đã được giao thành công' : 'đang được giao tới bạn')
    formData.append('order_id', order_id);
    formData.append('total_amount', total_amount);
    formData.append('shipping_address', shipping_address);
    formData.append('shipping_date', update_at);

    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send-form', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.status(200).send('Verification code sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }
});

module.exports = router;
