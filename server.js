const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json({limit:'50kb'}));
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || 'borix228@vk.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/lead', async (req,res)=>{
  const {name, contact, message} = req.body || {};
  if(!name || !contact || !message){
    return res.status(400).json({ok:false,error:'Заполните все поля'});
  }
  if(!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS){
    return res.status(503).json({ok:false,error:'SMTP не настроен на сервере'});
  }

  try {
    await transporter.sendMail({
      from: `"ALEXANDER.DEV" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: contact,
      subject: `Новая заявка с ALEXANDER.DEV — ${name}`,
      text: `Имя: ${name}\nКонтакт: ${contact}\n\nЗадача:\n${message}`
    });
    res.json({ok:true});
  } catch(err) {
    console.error(err);
    res.status(500).json({ok:false,error:'Не удалось отправить заявку'});
  }
});

app.get('/health', (_,res)=>res.json({ok:true}));

app.listen(PORT, ()=>console.log(`ALEXANDER.DEV listening on ${PORT}`));
