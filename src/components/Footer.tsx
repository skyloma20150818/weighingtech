"use client";

import React from 'react';
import Link from 'next/link';
import SmartImage from './SmartImage';
import { Language, translations } from '../i18n';

interface Contact {
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

// 只保留二维码图片配置，标题和副标题使用 i18n 固定值
interface Consult {
  wechat?: {
    qrImage?: string;
  };
  qq?: {
    qrImage?: string;
  };
}

interface FooterProps {
  lang: Language;
  contact?: Contact | null;
  consult?: Consult | null;
}

export default function Footer({ lang, contact, consult }: FooterProps) {
  const t = translations[lang];

  return (
    <footer id="footer" className="bg-[#1a2e4a] text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
              <SmartImage
                src="/logo.png"
                alt="唯英科技 Logo"
                width={160}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
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
                <span className="text-white">{contact?.address || '重庆市北碚区蔡家岗镇嘉德大道99号'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">{t.footer.quickLinks}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">{t.nav.home}</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">{t.nav.products}</Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white transition-colors">{t.nav.downloads}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">{t.nav.about}</Link>
              </li>
            </ul>
          </div>

          {/* QR Codes */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{t.footer.onlineConsulting}</h3>
              <p className="text-xs text-slate-400">{lang === 'zh' ? '扫码添加专属客服，获取详细报价与方案' : 'Scan QR code to add customer service'}</p>
            </div>
            <div className="flex gap-4">
              {/* 微信二维码 */}
              <div className="text-center">
                <div className="w-28 h-40 bg-white rounded-2xl p-2 mb-4 shadow-lg">
                  <SmartImage
                    src={consult?.wechat?.qrImage || "/uploads/about/cctv.mp4_20260318_213140722.jpg"}
                    alt="微信咨询"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-slate-400 pt-1">微信咨询</p>
              </div>
              {/* QQ二维码 */}
              <div className="text-center">
                <div className="w-28 h-40 bg-white rounded-2xl p-2 mb-4 shadow-lg">
                  <SmartImage
                    src={consult?.qq?.qrImage || "/uploads/about/cctv.mp4_20260318_213140722.jpg"}
                    alt="QQ咨询"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-slate-400 pt-1">QQ咨询</p>
              </div>
            </div>
          </div>
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
              <img
                src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"
                alt="公安备案图标"
                className="w-4 h-4"
              />
              渝公网安备 50010902001488号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
