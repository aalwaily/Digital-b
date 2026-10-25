import { isolateEmbeds } from "@/lib/i18n/bidi";
import type { Locale } from "@/lib/i18n/config";

const messages: Record<string, string> = {
  "Invalid request.": "طلب غير صالح.",
  "Choose at least one guide.": "اختر دليلًا واحدًا على الأقل.",
  "Enter a valid email address.": "أدخل بريدًا إلكترونيًا صالحًا.",
  "Could not price this order.": "تعذر تسعير هذا الطلب.",
  "Your cart is empty.": "سلتك فارغة.",
  "Too many items in one order.": "عناصر كثيرة في طلب واحد.",
  "Unknown product.": "منتج غير معروف.",
  "Download links are not configured.": "روابط التنزيل غير مُعدة.",
  "Card checkout is not available.": "الدفع بالبطاقة غير متاح.",
  "Demo checkout has to be confirmed on the checkout page.": "يجب تأكيد الدفع التجريبي في صفحة الدفع.",
  "Stripe did not return a checkout URL.": "لم يُرجع Stripe رابط الدفع.",
  "Payment could not be started. Check the Stripe configuration.": "تعذر بدء الدفع. راجع إعداد Stripe.",
  "Stripe is not configured.": "Stripe غير مُعد.",
  "Missing checkout session.": "جلسة الدفع غير موجودة.",
  "Payment is not complete yet.": "الدفع لم يكتمل بعد.",
  "Could not verify this payment.": "تعذر التحقق من هذا الدفع.",
  "Add your name.": "أضف اسمك.",
  "Choose a topic.": "اختر موضوعًا.",
  "Write a message of at least a sentence.": "اكتب رسالة من جملة على الأقل.",
  "The message could not be delivered.": "تعذر تسليم الرسالة.",
  "The signup could not be delivered.": "تعذر تسليم التسجيل.",
  "This download link is invalid or expired.": "رابط التنزيل غير صالح أو منتهٍ.",
  "That file is not part of this order.": "هذا الملف ليس جزءًا من هذا الطلب.",
  "The file is missing on the server.": "الملف غير موجود على الخادم.",
  "Moyasar is not configured.": "Moyasar غير مُعد.",
  "Hala is not configured.": "هلا غير مُعدة.",
  "Hala hosted checkout is not available yet.": "الدفع عبر هلا غير متاح بعد.",
  "Hala is not the active payment provider.": "هلا ليست وسيلة الدفع المفعّلة.",
  "Moyasar checkout could not be prepared.": "تعذر تجهيز الدفع عبر Moyasar.",
  "Apple Pay is not available in this browser.": "Apple Pay غير متاح في هذا المتصفح.",
  "Apple Pay could not be started.": "تعذر بدء Apple Pay.",
  "Apple Pay requires Safari over HTTPS on a registered domain.":
    "يتطلب Apple Pay متصفح Safari عبر HTTPS على نطاق مسجّل.",
  "Apple Pay could not verify this site. Nothing was charged.": "تعذر على Apple Pay التحقق من هذا الموقع. لم يُخصم شيء.",
  "Moyasar form failed to load.": "تعذر تحميل نموذج Moyasar.",
  "The payment was not completed.": "لم يكتمل الدفع.",
  "The Moyasar payment form could not be loaded. Try again.": "تعذر تحميل نموذج Moyasar. حاول مرة أخرى.",
  "Could not send the message.": "تعذر إرسال الرسالة.",
  "Could not add that email.": "تعذرت إضافة هذا البريد.",
  "Could not unlock that sample.": "تعذر فتح هذا النموذج.",
  "We could not confirm this payment.": "تعذر تأكيد هذا الدفع.",
  "Network error. Try again.": "خطأ في الشبكة. حاول مرة أخرى.",
  "Network error. Try again in a moment.": "خطأ في الشبكة. حاول بعد قليل.",
  "Network error while confirming payment.": "خطأ في الشبكة أثناء تأكيد الدفع.",
  "Checkout could not start.": "تعذر بدء الدفع.",
  "Checkout did not return a next step.": "لم يُرجع الدفع الخطوة التالية.",
  "Could not read this order.": "تعذرت قراءة هذا الطلب.",
};

export function translateMessage(locale: Locale, message: string) {
  if (locale !== "ar") return message;
  return isolateEmbeds(messages[message] ?? message);
}
