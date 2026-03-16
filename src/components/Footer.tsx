"use client";

import React from 'react';
import Link from 'next/link';
import { contact, consult } from '../data';
import { Language, translations } from '../i18n';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="唯英科技 Logo"
                className="h-12 object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="space-y-3 pt-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">{t.footer.phone}</span>
                <span className="text-white font-medium">{contact?.phone || '023-68283031'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">{t.footer.mobile}</span>
                <span className="text-white font-medium">{contact?.mobile || '13696475082'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">{t.footer.email}</span>
                <span className="text-white font-medium">{contact?.email || ''}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">{t.footer.address}</span>
                <span className="text-white font-medium leading-relaxed">{contact?.address || '重庆市北碚区龙凤桥街道龙凤三村200号附16号'}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 text-lg">{t.footer.quickLinks}</h4>
            <ul className="space-y-4">
              <li><Link href="/#products" className="text-slate-400 hover:text-white transition-colors">{t.footer.products}</Link></li>
              <li><Link href="/#solutions" className="text-slate-400 hover:text-white transition-colors">{t.footer.solutions}</Link></li>
              <li><Link href="/#about" className="text-slate-400 hover:text-white transition-colors">{t.footer.about}</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.footer.download}</a></li>
            </ul>
          </div>

          {/* QR Codes */}
          {(consult?.wechat?.enabled || consult?.qq?.enabled) && (
            <div className="lg:col-span-5">
              <h4 className="text-white font-bold mb-6 text-lg">{consult?.title || t.footer.onlineConsulting}</h4>
              <p className="text-slate-400 text-sm mb-6">{consult?.description || t.footer.scanQr}</p>

              <div className="flex flex-wrap gap-8">
                {consult?.wechat?.enabled && consult?.wechat?.qrImage && (
                  <div className="text-center">
                    <div className="w-28 h-28 bg-white rounded-2xl p-2 mb-3 shadow-lg">
                      <img src={consult.wechat.qrImage} alt="微信咨询" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{consult.wechat?.label || t.footer.wechat}</span>
                  </div>
                )}
                {consult?.qq?.enabled && consult?.qq?.qrImage && (
                  <div className="text-center">
                    <div className="w-28 h-28 bg-white rounded-2xl p-2 mb-3 shadow-lg">
                      <img src={consult.qq.qrImage} alt="QQ咨询" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{consult.qq?.label || t.footer.qq}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col items-center gap-4 text-sm text-slate-500">
          <div className="text-center">
            Copyright © 2002-2019 Chongqing Weighing Technology Co., Ltd. All rights reserved
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              ICP:渝ICP备14003796号-1
            </a>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010902001488" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              <img src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png" alt="公安备案图标" className="w-4 h-4" />
              渝公网安备 50010902001488号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
