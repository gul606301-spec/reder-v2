# READER PROJECT — IMPORTANT DEVELOPMENT RULES

Bu proje sıfırdan oluşturulacak bir demo değildir.
Mevcut çalışan Reader uygulaması üzerinde geliştirme yapıyoruz.

## 1. MEVCUT KODU KORU
- Mevcut ekranları silme.
- Mevcut navigation yapısını değiştirme.
- Mevcut componentleri gereksiz yere yeniden yazma.
- Mevcut tasarımı değiştirme.
- Mevcut renkleri, fontları, spacingleri ve UI dilini koru.
- Mevcut çalışan feature'ları kaldırma veya değiştirme.
- ReaderContext ve mevcut state/data yapılarını gereksiz yere değiştirme.

## 2. FAKE DATA KULLANMA
- Fake kullanıcı oluşturma.
- Fake profil oluşturma.
- Fake gönderi oluşturma.
- Fake yorum oluşturma.
- Fake takipçi oluşturma.
- Fake kitap aktivitesi oluşturma.
- Seed/demo data ekleme.
- Uygulama açıldığında örnek sosyal medya içeriği gösterme.
- Eğer mevcut projede zaten mock/test data varsa: BUNU ÇOĞALTMA, yeni fake data ekleme. Mevcut gerçek/boş state yapısını koru.

## 3. SADECE İSTENEN ÖZELLİĞİ DEĞİŞTİR
Promptta açıkça belirtilmeyen hiçbir yeni feature ekleme.
"Bu özellik için gerekli olabilir" diyerek:
- yeni ekran,
- yeni kullanıcı,
- yeni post,
- yeni database tablosu,
- yeni navigation,
- yeni tasarım oluşturma.
Gerçekten teknik olarak zorunlu değilse hiçbir ek değişiklik yapma.

## 4. MEVCUT DAVRANIŞLARI KORU
Bir feature zaten çalışıyorsa, yeni özellik eklerken mevcut davranışını bozma.

## 5. TASARIM
Reader'ın mevcut tasarım dilini koru (krem arka plan, lacivert, mercan vurgu tonları ve mevcut estetik).
Yeni bir renk sistemi veya yeni bir tasarım sistemi oluşturma.

## 6. DEĞİŞİKLİK ÖNCESİ
Önce projeyi incele.
İlgili componentleri, navigation'ı, state/context yapısını, mevcut data akışını ve ilgili ekranı tespit et.
Sonra yalnızca gerekli dosyalarda değişiklik yap.

## 7. DEĞİŞİKLİK SONRASI
Değiştirdiğin dosyaları ve yaptığın değişiklikleri listele.
Ayrıca hangi mevcut davranışların korunduğunu ve hangi yeni davranışın eklendiğini belirt.

## 8. BELİRSİZLİK
Bir gereksinim açık değilse kendin feature uydurma.
Önce mevcut kod yapısını incele ve mümkün olan en küçük değişikliği yap.

## 9. KAPSAM
Her görev yalnızca o promptta açıkça belirtilen feature ile sınırlıdır.
Başka ekranlara veya feature'lara dokunma.
