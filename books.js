/* =====================================================================
   ZARVARAQ — books.js
   Kitoblar bazasi (270 ta kitob, 15 kategoriya).
   Bu fayl IKKI joyda ishlatiladi:
     1) Brauzerda  — window.ZV.BOOKS (katalog, savatcha)
     2) Serverda   — netlify/functions/order.js narxlarni shu fayldan tekshiradi
   Shuning uchun narxlar faqat shu yerda hisoblanadi; frontend yuborgan narxga
   server ishonmaydi.
   ===================================================================== */
(function (root) {
  "use strict";

  // Kategoriya kalitlari (nomlari translations.js ichida 3 tilda)
  var CATEGORIES = [
    { id: "fiction",    icon: "✒️", color: "#2f5d50", base: 45000 },
    { id: "detective",  icon: "🔍", color: "#3b3f58", base: 55000 },
    { id: "scifi",      icon: "🚀", color: "#27476e", base: 60000 },
    { id: "history",    icon: "🏛️", color: "#7a4b2a", base: 70000 },
    { id: "psychology", icon: "🧠", color: "#6b3f69", base: 65000 },
    { id: "business",   icon: "📈", color: "#1f5f5b", base: 75000 },
    { id: "it",         icon: "💻", color: "#23395b", base: 120000 },
    { id: "selfdev",    icon: "🌱", color: "#4d6b2f", base: 60000 },
    { id: "kids",       icon: "🧸", color: "#b5653a", base: 40000 },
    { id: "science",    icon: "🔬", color: "#2c5a73", base: 70000 },
    { id: "philosophy", icon: "🦉", color: "#5a4a3a", base: 55000 },
    { id: "world",      icon: "🌍", color: "#7b2d3b", base: 65000 },
    { id: "religion",   icon: "🕌", color: "#1e5a43", base: 80000 },
    { id: "education",  icon: "🎓", color: "#3d4f7a", base: 90000 },
    { id: "biography",  icon: "👤", color: "#6e5a2a", base: 85000 }
  ];

  /* Har bir qator:
     [kategoriya, nom(UZ), nom(EN/original), nom(RU), muallif, nashr yili, sahifa, til(u/e/r), belgi(b=bestseller, n=yangi)] */
  var RAW = [
    // ---------- Badiiy adabiyot ----------
    ["fiction","O‘tkan kunlar","Bygone Days","Минувшие дни","Abdulla Qodiriy",1926,400,"u","b"],
    ["fiction","Mehrobdan chayon","Scorpion from the Altar","Скорпион из алтаря","Abdulla Qodiriy",1929,352,"u",""],
    ["fiction","Kecha va kunduz","Night and Day","Ночь и день","Abdulhamid Cho‘lpon",1936,304,"u","b"],
    ["fiction","Sarob","Mirage","Мираж","Abdulla Qahhor",1937,320,"u",""],
    ["fiction","Ufq","Horizon","Горизонт","Said Ahmad",1974,560,"u",""],
    ["fiction","Ikki eshik orasi","Between Two Doors","Между двух дверей","O‘tkir Hoshimov",1986,480,"u","b"],
    ["fiction","Dunyoning ishlari","Affairs of the World","Дела мирские","O‘tkir Hoshimov",1982,240,"u","b"],
    ["fiction","Shum bola","The Mischievous Boy","Озорник","G‘afur G‘ulom",1936,192,"u",""],
    ["fiction","Sariq devni minib","Riding the Yellow Giant","Верхом на жёлтом диве","Xudoyberdi To‘xtaboyev",1968,256,"u",""],
    ["fiction","Otamdan qolgan dalalar","The Fields My Father Left","Поля, оставшиеся от отца","Tog‘ay Murod",1994,320,"u",""],
    ["fiction","Oydinda yurgan odamlar","People Walking in Moonlight","Люди, идущие при луне","Tog‘ay Murod",1977,160,"u",""],
    ["fiction","Jimjitlik","Silence","Тишина","Said Ahmad",1988,384,"u",""],
    ["fiction","Daftar hoshiyasidagi bitiklar","Notes in the Margins of a Notebook","Записи на полях тетради","O‘tkir Hoshimov",2002,256,"u","n"],
    ["fiction","Bahor qaytmaydi","Spring Will Not Return","Весна не вернётся","O‘tkir Hoshimov",1970,224,"u",""],
    ["fiction","Qiyomat","The Place of the Skull","Плаха","Chingiz Aytmatov",1986,416,"u",""],
    ["fiction","Asrni qaritgan kun","The Day Lasts More Than a Hundred Years","И дольше века длится день","Chingiz Aytmatov",1980,448,"u","b"],
    ["fiction","Jamila","Jamilia","Джамиля","Chingiz Aytmatov",1958,128,"u",""],
    ["fiction","Oq kema","The White Ship","Белый пароход","Chingiz Aytmatov",1970,176,"u",""],

    // ---------- Detektiv ----------
    ["detective","Sherlok Xolms sarguzashtlari","The Adventures of Sherlock Holmes","Приключения Шерлока Холмса","Arthur Conan Doyle",1892,320,"u","b"],
    ["detective","Baskervillar iti","The Hound of the Baskervilles","Собака Баскервилей","Arthur Conan Doyle",1902,256,"u",""],
    ["detective","Sharq ekspressidagi qotillik","Murder on the Orient Express","Убийство в «Восточном экспрессе»","Agatha Christie",1934,256,"u","b"],
    ["detective","Va hech kim qolmadi","And Then There Were None","И никого не стало","Agatha Christie",1939,272,"u",""],
    ["detective","Rojer Akroydning o‘ldirilishi","The Murder of Roger Ackroyd","Убийство Роджера Экройда","Agatha Christie",1926,288,"r",""],
    ["detective","Ajdar tatuirovkali qiz","The Girl with the Dragon Tattoo","Девушка с татуировкой дракона","Stieg Larsson",2005,544,"r",""],
    ["detective","Da Vinchi kodi","The Da Vinci Code","Код да Винчи","Dan Brown",2003,480,"u","b"],
    ["detective","Farishtalar va iblislar","Angels & Demons","Ангелы и демоны","Dan Brown",2000,576,"r",""],
    ["detective","Inferno","Inferno","Инферно","Dan Brown",2013,480,"r",""],
    ["detective","G‘oyib bo‘lgan qiz","Gone Girl","Исчезнувшая","Gillian Flynn",2012,432,"r",""],
    ["detective","Qo‘zilar sukunati","The Silence of the Lambs","Молчание ягнят","Thomas Harris",1988,368,"r",""],
    ["detective","Jim bemor","The Silent Patient","Безмолвный пациент","Alex Michaelides",2019,336,"u","b"],
    ["detective","Poyezddagi qiz","The Girl on the Train","Девушка в поезде","Paula Hawkins",2015,336,"r",""],
    ["detective","Payshanba qotillik klubi","The Thursday Murder Club","Клуб убийств по четвергам","Richard Osman",2020,384,"e","n"],
    ["detective","Shamol soyasi","The Shadow of the Wind","Тень ветра","Carlos Ruiz Zafón",2001,528,"r",""],
    ["detective","Azazel","The Winter Queen","Азазель","Boris Akunin",1998,256,"r",""],
    ["detective","Malta lochini","The Maltese Falcon","Мальтийский сокол","Dashiell Hammett",1930,224,"e",""],
    ["detective","Katta uyqu","The Big Sleep","Глубокий сон","Raymond Chandler",1939,256,"e",""],

    // ---------- Fantastika ----------
    ["scifi","Dyuna","Dune","Дюна","Frank Herbert",1965,704,"r","b"],
    ["scifi","Asos","Foundation","Основание","Isaac Asimov",1951,288,"r",""],
    ["scifi","Men, robot","I, Robot","Я, робот","Isaac Asimov",1950,272,"u",""],
    ["scifi","1984","Nineteen Eighty-Four","1984","George Orwell",1949,328,"u","b"],
    ["scifi","Jasur yangi dunyo","Brave New World","О дивный новый мир","Aldous Huxley",1932,288,"r",""],
    ["scifi","Farengeyt bo‘yicha 451 daraja","Fahrenheit 451","451 градус по Фаренгейту","Ray Bradbury",1953,256,"u",""],
    ["scifi","Mars yilnomalari","The Martian Chronicles","Марсианские хроники","Ray Bradbury",1950,272,"r",""],
    ["scifi","Marslik","The Martian","Марсианин","Andy Weir",2011,384,"r",""],
    ["scifi","«Salom Maryam» loyihasi","Project Hail Mary","Проект «Аве Мария»","Andy Weir",2021,496,"e","bn"],
    ["scifi","Uch jism muammosi","The Three-Body Problem","Задача трёх тел","Liu Cixin",2008,400,"r","b"],
    ["scifi","Galaktika bo‘ylab avtostop","The Hitchhiker's Guide to the Galaxy","Автостопом по галактике","Douglas Adams",1979,224,"e",""],
    ["scifi","Neyromant","Neuromancer","Нейромант","William Gibson",1984,288,"e",""],
    ["scifi","Ender o‘yini","Ender's Game","Игра Эндера","Orson Scott Card",1985,352,"r",""],
    ["scifi","Solyaris","Solaris","Солярис","Stanisław Lem",1961,256,"r",""],
    ["scifi","Yo‘l bo‘yidagi piknik","Roadside Picnic","Пикник на обочине","Arkady and Boris Strugatsky",1972,224,"r",""],
    ["scifi","Uzuk birodarligi","The Fellowship of the Ring","Братство Кольца","J.R.R. Tolkien",1954,432,"u","b"],
    ["scifi","Xobbit","The Hobbit","Хоббит","J.R.R. Tolkien",1937,320,"u",""],
    ["scifi","Taxtlar o‘yini","A Game of Thrones","Игра престолов","George R.R. Martin",1996,720,"r",""],

    // ---------- Tarixiy ----------
    ["history","Boburnoma","Baburnama","Бабур-наме","Zahiriddin Muhammad Bobur",1530,560,"u","b"],
    ["history","Yulduzli tunlar","Starry Nights","Звёздные ночи","Pirimqul Qodirov",1978,520,"u","b"],
    ["history","Temur tuzuklari","The Institutes of Timur","Уложение Тимура","Amir Temur",1385,192,"u",""],
    ["history","Ulug‘bek xazinasi","Ulugbek's Treasure","Сокровища Улугбека","Odil Yoqubov",1973,448,"u",""],
    ["history","Avlodlar dovoni","The Pass of Generations","Перевал поколений","Pirimqul Qodirov",1988,480,"u",""],
    ["history","Ulug‘ saltanat","The Great Sultanate","Великий султанат","Muhammad Ali",2002,600,"u",""],
    ["history","Sapiens: insoniyatning qisqacha tarixi","Sapiens: A Brief History of Humankind","Sapiens. Краткая история человечества","Yuval Noah Harari",2011,464,"u","b"],
    ["history","Qurol, mikroblar va po‘lat","Guns, Germs, and Steel","Ружья, микробы и сталь","Jared Diamond",1997,528,"r",""],
    ["history","Ipak yo‘llari","The Silk Roads","Шёлковый путь","Peter Frankopan",2015,656,"r",""],
    ["history","Avgust to‘plari","The Guns of August","Августовские пушки","Barbara W. Tuchman",1962,640,"e",""],
    ["history","SPQR: Qadimgi Rim tarixi","SPQR: A History of Ancient Rome","SPQR. История Древнего Рима","Mary Beard",2015,608,"r",""],
    ["history","Chingizxon va zamonaviy dunyo","Genghis Khan and the Making of the Modern World","Чингисхан и рождение современного мира","Jack Weatherford",2004,352,"r",""],
    ["history","Urush san’ati","The Art of War","Искусство войны","Sun Tzu",-500,160,"u","b"],
    ["history","Anna Frank kundaligi","The Diary of a Young Girl","Дневник Анны Франк","Anne Frank",1947,352,"r",""],
    ["history","Usmon orzusi","Osman's Dream","Мечта Османа","Caroline Finkel",2005,704,"e",""],
    ["history","Buyuk o‘yin","The Great Game","Большая игра","Peter Hopkirk",1990,592,"e",""],
    ["history","Yo‘qotilgan ma’rifat","Lost Enlightenment","Утраченное Просвещение","S. Frederick Starr",2013,696,"u","b"],
    ["history","Samarqand","Samarkand","Самарканд","Amin Maalouf",1988,320,"r",""],

    // ---------- Psixologiya ----------
    ["psychology","Tez va sekin fikrlash","Thinking, Fast and Slow","Думай медленно… решай быстро","Daniel Kahneman",2011,512,"u","b"],
    ["psychology","Hayot ma’nosini izlab","Man's Search for Meaning","Человек в поисках смысла","Viktor E. Frankl",1946,184,"u","b"],
    ["psychology","Emotsional intellekt","Emotional Intelligence","Эмоциональный интеллект","Daniel Goleman",1995,384,"u",""],
    ["psychology","Ta’sir psixologiyasi","Influence: The Psychology of Persuasion","Психология влияния","Robert B. Cialdini",1984,336,"r",""],
    ["psychology","Odamlar o‘ynaydigan o‘yinlar","Games People Play","Игры, в которые играют люди","Eric Berne",1964,216,"r",""],
    ["psychology","Tana hamma narsani eslaydi","The Body Keeps the Score","Тело помнит всё","Bessel van der Kolk",2014,464,"r",""],
    ["psychology","Sokinlik kuchi","Quiet: The Power of Introverts","Интроверты","Susan Cain",2012,368,"r",""],
    ["psychology","Fikrlash tarzi","Mindset: The New Psychology of Success","Гибкое сознание","Carol S. Dweck",2006,288,"u",""],
    ["psychology","Oqim","Flow","Поток","Mihaly Csikszentmihalyi",1990,336,"r",""],
    ["psychology","Oldindan aytsa bo‘ladigan mantiqsizlik","Predictably Irrational","Предсказуемая иррациональность","Dan Ariely",2008,304,"r",""],
    ["psychology","Erkaklar Marsdan, ayollar Veneradan","Men Are from Mars, Women Are from Venus","Мужчины с Марса, женщины с Венеры","John Gray",1992,368,"u",""],
    ["psychology","Besh sevgi tili","The 5 Love Languages","Пять языков любви","Gary Chapman",1992,208,"u","b"],
    ["psychology","Kayfiyat terapiyasi","Feeling Good","Терапия настроения","David D. Burns",1980,736,"r",""],
    ["psychology","Psixopat testi","The Psychopath Test","Тест на психопата","Jon Ronson",2011,288,"r",""],
    ["psychology","Baxtga qoqilib","Stumbling on Happiness","Спотыкаясь о счастье","Daniel Gilbert",2006,336,"e",""],
    ["psychology","Qat’iyat","Grit","Твёрдость характера","Angela Duckworth",2016,352,"r",""],
    ["psychology","Yoqmaslikka jur’at","The Courage to Be Disliked","Смелость не нравиться","Ichiro Kishimi, Fumitake Koga",2013,288,"u","n"],
    ["psychology","Bog‘lanish","Attached","Привязанность","Amir Levine, Rachel Heller",2010,304,"r",""],

    // ---------- Biznes va moliya ----------
    ["business","Boy ota, kambag‘al ota","Rich Dad Poor Dad","Богатый папа, бедный папа","Robert T. Kiyosaki",1997,336,"u","b"],
    ["business","O‘ylang va boying","Think and Grow Rich","Думай и богатей","Napoleon Hill",1937,320,"u","b"],
    ["business","Bobilning eng boy odami","The Richest Man in Babylon","Самый богатый человек в Вавилоне","George S. Clason",1926,192,"u",""],
    ["business","Pul psixologiyasi","The Psychology of Money","Психология денег","Morgan Housel",2020,256,"u","b"],
    ["business","Aqlli investor","The Intelligent Investor","Разумный инвестор","Benjamin Graham",1949,640,"r",""],
    ["business","Noldan birgacha","Zero to One","От нуля к единице","Peter Thiel",2014,224,"u",""],
    ["business","Tejamkor startap","The Lean Startup","Бизнес с нуля","Eric Ries",2011,336,"r",""],
    ["business","Yaxshidan buyukka","Good to Great","От хорошего к великому","Jim Collins",2001,320,"r",""],
    ["business","Innovator dilemmasi","The Innovator's Dilemma","Дилемма инноватора","Clayton M. Christensen",1997,288,"e",""],
    ["business","Moviy okean strategiyasi","Blue Ocean Strategy","Стратегия голубого океана","W. Chan Kim, Renée Mauborgne",2005,320,"r",""],
    ["business","Krossovka sotuvchisi","Shoe Dog","Продавец обуви","Phil Knight",2016,400,"u",""],
    ["business","Oson bo‘lmaydi","The Hard Thing About Hard Things","Легко не будет","Ben Horowitz",2014,304,"r",""],
    ["business","Haftasiga 4 soat ishlash","The 4-Hour Workweek","Как работать по 4 часа в неделю","Tim Ferriss",2007,416,"r",""],
    ["business","Rework: qoidasiz biznes","Rework","Rework. Бизнес без предрассудков","Jason Fried, David Heinemeier Hansson",2010,288,"r",""],
    ["business","Frikonomika","Freakonomics","Фрикономика","Steven D. Levitt, Stephen J. Dubner",2005,320,"r",""],
    ["business","Qo‘shnim — millioner","The Millionaire Next Door","Мой сосед — миллионер","Thomas J. Stanley",1996,272,"r",""],
    ["business","Muhimini o‘lchang","Measure What Matters","Измеряйте самое важное","John Doerr",2018,320,"r",""],
    ["business","Prinsiplar","Principles","Принципы","Ray Dalio",2017,592,"r","b"],

    // ---------- Dasturlash va IT ----------
    ["it","Toza kod","Clean Code","Чистый код","Robert C. Martin",2008,464,"e","b"],
    ["it","Pragmatik dasturchi","The Pragmatic Programmer","Программист-прагматик","Andrew Hunt, David Thomas",1999,352,"e","b"],
    ["it","Dizayn patternlari","Design Patterns","Приёмы объектно-ориентированного проектирования","Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",1994,416,"e",""],
    ["it","Algoritmlarga kirish","Introduction to Algorithms","Алгоритмы: построение и анализ","Thomas H. Cormen",1990,1312,"e",""],
    ["it","Algoritmlarni tushunish","Grokking Algorithms","Грокаем алгоритмы","Aditya Bhargava",2016,256,"r","b"],
    ["it","JS’ni hali bilmaysiz","You Don't Know JS Yet","Вы пока ещё не знаете JS","Kyle Simpson",2020,280,"e",""],
    ["it","Ifodali JavaScript","Eloquent JavaScript","Выразительный JavaScript","Marijn Haverbeke",2011,472,"e",""],
    ["it","JavaScript: kuchli tomonlari","JavaScript: The Good Parts","JavaScript: сильные стороны","Douglas Crockford",2008,176,"e",""],
    ["it","Refaktoring","Refactoring","Рефакторинг","Martin Fowler",1999,448,"e",""],
    ["it","Mukammal kod","Code Complete","Совершенный код","Steve McConnell",1993,960,"r",""],
    ["it","Yuqori yuklamali ilovalar","Designing Data-Intensive Applications","Высоконагруженные приложения","Martin Kleppmann",2017,616,"e","b"],
    ["it","Dasturlash intervyusiga tayyorgarlik","Cracking the Coding Interview","Карьера программиста","Gayle Laakmann McDowell",2008,708,"e",""],
    ["it","Python: tezkor kurs","Python Crash Course","Изучаем Python","Eric Matthes",2015,544,"e",""],
    ["it","Zerikarli ishlarni Python bilan avtomatlashtirish","Automate the Boring Stuff with Python","Автоматизация рутинных задач с Python","Al Sweigart",2015,504,"e",""],
    ["it","Afsonaviy odam-oy","The Mythical Man-Month","Мифический человеко-месяц","Frederick P. Brooks Jr.",1975,336,"e",""],
    ["it","Toza arxitektura","Clean Architecture","Чистая архитектура","Robert C. Martin",2017,432,"e",""],
    ["it","Dizayn patternlari: oson yo‘l","Head First Design Patterns","Паттерны проектирования","Eric Freeman, Elisabeth Robson",2004,694,"e",""],
    ["it","CSS: to‘liq qo‘llanma","CSS: The Definitive Guide","CSS. Полное руководство","Eric A. Meyer",2023,1126,"e","n"],

    // ---------- Shaxsiy rivojlanish ----------
    ["selfdev","Atom odatlar","Atomic Habits","Атомные привычки","James Clear",2018,320,"u","b"],
    ["selfdev","Yuksak samarali insonlarning 7 ko‘nikmasi","The 7 Habits of Highly Effective People","7 навыков высокоэффективных людей","Stephen R. Covey",1989,432,"u","b"],
    ["selfdev","Do‘st orttirish va odamlarga ta’sir o‘tkazish","How to Win Friends and Influence People","Как завоёвывать друзей и оказывать влияние на людей","Dale Carnegie",1936,320,"u","b"],
    ["selfdev","Hozirgi lahzaning kuchi","The Power of Now","Сила настоящего","Eckhart Tolle",1997,236,"r",""],
    ["selfdev","Chuqur ish","Deep Work","В работу с головой","Cal Newport",2016,304,"u",""],
    ["selfdev","Ikigai","Ikigai","Икигай","Héctor García, Francesc Miralles",2016,208,"u",""],
    ["selfdev","Tong mo‘jizasi","The Miracle Morning","Магия утра","Hal Elrod",2012,176,"u",""],
    ["selfdev","Qurbaqani yeng!","Eat That Frog!","Съешьте лягушку!","Brian Tracy",2001,144,"u",""],
    ["selfdev","Essensializm","Essentialism","Эссенциализм","Greg McKeown",2014,272,"r",""],
    ["selfdev","Ijobiy fikrlash kuchi","The Power of Positive Thinking","Сила позитивного мышления","Norman Vincent Peale",1952,256,"r",""],
    ["selfdev","Odat kuchi","The Power of Habit","Сила привычки","Charles Duhigg",2012,400,"r",""],
    ["selfdev","5 soniya qoidasi","The 5 Second Rule","Правило 5 секунд","Mel Robbins",2017,240,"r",""],
    ["selfdev","Ego — dushman","Ego Is the Enemy","Эго — враг","Ryan Holiday",2016,256,"r",""],
    ["selfdev","To‘siq — bu yo‘l","The Obstacle Is the Way","Препятствие — это путь","Ryan Holiday",2014,224,"r",""],
    ["selfdev","Meni sindirolmaysan","Can't Hurt Me","Меня не сломить","David Goggins",2018,364,"u",""],
    ["selfdev","To‘rt ming hafta","Four Thousand Weeks","Четыре тысячи недель","Oliver Burkeman",2021,288,"e","n"],
    ["selfdev","Sekin samaradorlik","Slow Productivity","Медленная продуктивность","Cal Newport",2024,256,"e","n"],
    ["selfdev","Kichik odatlar","Tiny Habits","Крошечные привычки","BJ Fogg",2019,320,"r",""],

    // ---------- Bolalar adabiyoti ----------
    ["kids","Kichkina shahzoda","The Little Prince","Маленький принц","Antoine de Saint-Exupéry",1943,96,"u","b"],
    ["kids","Garri Potter va falsafa toshi","Harry Potter and the Philosopher's Stone","Гарри Поттер и философский камень","J.K. Rowling",1997,320,"u","b"],
    ["kids","Garri Potter va maxfiy xona","Harry Potter and the Chamber of Secrets","Гарри Поттер и Тайная комната","J.K. Rowling",1998,352,"u",""],
    ["kids","Garri Potter va Azkaban mahbusi","Harry Potter and the Prisoner of Azkaban","Гарри Поттер и узник Азкабана","J.K. Rowling",1999,448,"u",""],
    ["kids","Alisa mo‘jizalar mamlakatida","Alice's Adventures in Wonderland","Алиса в Стране чудес","Lewis Carroll",1865,192,"u",""],
    ["kids","Pinokkio sarguzashtlari","The Adventures of Pinocchio","Приключения Пиноккио","Carlo Collodi",1883,208,"u",""],
    ["kids","Charli va shokolad fabrikasi","Charlie and the Chocolate Factory","Чарли и шоколадная фабрика","Roald Dahl",1964,192,"r",""],
    ["kids","Matilda","Matilda","Матильда","Roald Dahl",1988,240,"r",""],
    ["kids","Sharlotta to‘ri","Charlotte's Web","Паутина Шарлотты","E.B. White",1952,192,"e",""],
    ["kids","Sher, jodugar va javon","The Lion, the Witch and the Wardrobe","Лев, колдунья и платяной шкаф","C.S. Lewis",1950,208,"r",""],
    ["kids","Vinni-Pux","Winnie-the-Pooh","Винни-Пух","A.A. Milne",1926,176,"u",""],
    ["kids","Pippi Uzunpaypoq","Pippi Longstocking","Пеппи Длинныйчулок","Astrid Lindgren",1945,160,"u",""],
    ["kids","Tom Soyerning sarguzashtlari","The Adventures of Tom Sawyer","Приключения Тома Сойера","Mark Twain",1876,272,"u",""],
    ["kids","Jungli kitobi","The Jungle Book","Книга джунглей","Rudyard Kipling",1894,256,"u",""],
    ["kids","Piter Pen","Peter Pan","Питер Пэн","J.M. Barrie",1911,192,"u",""],
    ["kids","Kichkina jodugar","The Little Witch","Маленькая Баба-Яга","Otfried Preußler",1957,128,"r",""],
    ["kids","Lapashang bolaning kundaligi","Diary of a Wimpy Kid","Дневник слабака","Jeff Kinney",2007,224,"r",""],
    ["kids","Bolalik","Childhood","Детство","Oybek",1963,240,"u",""],

    // ---------- Ilmiy ----------
    ["science","Vaqtning qisqacha tarixi","A Brief History of Time","Краткая история времени","Stephen Hawking",1988,256,"u","b"],
    ["science","Koinot","Cosmos","Космос","Carl Sagan",1980,432,"r",""],
    ["science","Xudbin gen","The Selfish Gene","Эгоистичный ген","Richard Dawkins",1976,360,"r",""],
    ["science","Gen: shaxsiy tarix","The Gene: An Intimate History","Ген. Очень личная история","Siddhartha Mukherjee",2016,592,"r",""],
    ["science","Deyarli hamma narsaning qisqacha tarixi","A Short History of Nearly Everything","Краткая история почти всего на свете","Bill Bryson",2003,544,"r",""],
    ["science","Shoshilayotganlar uchun astrofizika","Astrophysics for People in a Hurry","Астрофизика с космической скоростью","Neil deGrasse Tyson",2017,224,"u",""],
    ["science","Turlarning kelib chiqishi","On the Origin of Species","Происхождение видов","Charles Darwin",1859,512,"r",""],
    ["science","Nafis olam","The Elegant Universe","Элегантная Вселенная","Brian Greene",1999,448,"r",""],
    ["science","Homo Deus: kelajakning qisqacha tarixi","Homo Deus: A Brief History of Tomorrow","Homo Deus. Краткая история будущего","Yuval Noah Harari",2015,464,"u","b"],
    ["science","Barcha kasalliklar shohi","The Emperor of All Maladies","Царь всех болезней","Siddhartha Mukherjee",2010,608,"e",""],
    ["science","Nega uxlaymiz","Why We Sleep","Зачем мы спим","Matthew Walker",2017,368,"r",""],
    ["science","Fizikadan yetti qisqa dars","Seven Brief Lessons on Physics","Семь этюдов по физике","Carlo Rovelli",2014,96,"r",""],
    ["science","Genrietta Laksning o‘lmas hayoti","The Immortal Life of Henrietta Lacks","Бессмертная жизнь Генриетты Лакс","Rebecca Skloot",2010,384,"e",""],
    ["science","Sokin bahor","Silent Spring","Безмолвная весна","Rachel Carson",1962,368,"e",""],
    ["science","Ilmiy inqiloblar tuzilishi","The Structure of Scientific Revolutions","Структура научных революций","Thomas S. Kuhn",1962,264,"r",""],
    ["science","Al-jabr val-muqobala","The Compendious Book on Calculation by Completion and Balancing","Краткая книга об исчислении аль-джабра и аль-мукабалы","Muhammad al-Xorazmiy",820,160,"u","b"],
    ["science","Tib qonunlari","The Canon of Medicine","Канон врачебной науки","Abu Ali ibn Sino",1025,720,"u",""],
    ["science","Albatta hazillashyapsiz, janob Feynman!","Surely You're Joking, Mr. Feynman!","Вы, конечно, шутите, мистер Фейнман!","Richard P. Feynman",1985,352,"r",""],

    // ---------- Falsafa ----------
    ["philosophy","Davlat","The Republic","Государство","Platon",-375,416,"r",""],
    ["philosophy","Nikomax axloqi","Nicomachean Ethics","Никомахова этика","Arastu",-340,352,"r",""],
    ["philosophy","O‘z-o‘zimga mulohazalar","Meditations","Размышления","Marcus Aurelius",180,256,"u","b"],
    ["philosophy","Zardusht shunday degan edi","Thus Spoke Zarathustra","Так говорил Заратустра","Friedrich Nietzsche",1883,352,"r",""],
    ["philosophy","Hukmdor","The Prince","Государь","Niccolò Machiavelli",1532,160,"u","b"],
    ["philosophy","Sizif haqida afsona","The Myth of Sisyphus","Миф о Сизифе","Albert Camus",1942,192,"r",""],
    ["philosophy","Sofi dunyosi","Sophie's World","Мир Софии","Jostein Gaarder",1991,544,"u",""],
    ["philosophy","Lutsiliyga maktublar","Letters from a Stoic","Нравственные письма к Луцилию","Seneca",65,256,"r",""],
    ["philosophy","Fozil odamlar shahri","The Virtuous City","Трактат о взглядах жителей добродетельного города","Abu Nasr Forobiy",942,224,"u",""],
    ["philosophy","Qutadg‘u bilig","Wisdom of Royal Glory","Благодатное знание","Yusuf Xos Hojib",1069,480,"u",""],
    ["philosophy","Dao de szin","Tao Te Ching","Дао дэ цзин","Lao Tzu",-400,128,"r",""],
    ["philosophy","Sof aqlning tanqidi","Critique of Pure Reason","Критика чистого разума","Immanuel Kant",1781,784,"r",""],
    ["philosophy","Borliq va vaqt","Being and Time","Бытие и время","Martin Heidegger",1927,608,"r",""],
    ["philosophy","Mahbub ul-qulub","Beloved of Hearts","Возлюбленный сердец","Alisher Navoiy",1500,208,"u","b"],
    ["philosophy","XXI asr uchun 21 saboq","21 Lessons for the 21st Century","21 урок для XXI века","Yuval Noah Harari",2018,368,"u",""],
    ["philosophy","Yaxshilik va yomonlikdan narida","Beyond Good and Evil","По ту сторону добра и зла","Friedrich Nietzsche",1886,288,"r",""],
    ["philosophy","Metod haqida mulohaza","Discourse on the Method","Рассуждение о методе","René Descartes",1637,128,"r",""],
    ["philosophy","Falsafa tasallisi","The Consolations of Philosophy","Утешение философией","Alain de Botton",2000,272,"r",""],

    // ---------- Jahon adabiyoti ----------
    ["world","Urush va tinchlik","War and Peace","Война и мир","Leo Tolstoy",1869,1296,"r","b"],
    ["world","Anna Karenina","Anna Karenina","Анна Каренина","Leo Tolstoy",1878,864,"r",""],
    ["world","Jinoyat va jazo","Crime and Punishment","Преступление и наказание","Fyodor Dostoevsky",1866,608,"u","b"],
    ["world","Aka-uka Karamazovlar","The Brothers Karamazov","Братья Карамазовы","Fyodor Dostoevsky",1880,824,"r",""],
    ["world","Usta va Margarita","The Master and Margarita","Мастер и Маргарита","Mikhail Bulgakov",1967,480,"r","b"],
    ["world","Yolg‘izlikning yuz yili","One Hundred Years of Solitude","Сто лет одиночества","Gabriel García Márquez",1967,448,"u",""],
    ["world","Buyuk Getsbi","The Great Gatsby","Великий Гэтсби","F. Scott Fitzgerald",1925,208,"u",""],
    ["world","Masxarabozni o‘ldirish","To Kill a Mockingbird","Убить пересмешника","Harper Lee",1960,336,"r",""],
    ["world","G‘urur va xurofot","Pride and Prejudice","Гордость и предубеждение","Jane Austen",1813,432,"u",""],
    ["world","Chol va dengiz","The Old Man and the Sea","Старик и море","Ernest Hemingway",1952,128,"u",""],
    ["world","Alkimyogar","The Alchemist","Алхимик","Paulo Coelho",1988,208,"u","b"],
    ["world","Javdarzor ustidagi jarlikda","The Catcher in the Rye","Над пропастью во ржи","J.D. Salinger",1951,288,"r",""],
    ["world","Uch og‘ayni","Three Comrades","Три товарища","Erich Maria Remarque",1936,480,"u",""],
    ["world","G‘arbiy frontda o‘zgarish yo‘q","All Quiet on the Western Front","На Западном фронте без перемен","Erich Maria Remarque",1929,256,"r",""],
    ["world","Bechoralar","Les Misérables","Отверженные","Victor Hugo",1862,1472,"r",""],
    ["world","Graf Monte-Kristo","The Count of Monte Cristo","Граф Монте-Кристо","Alexandre Dumas",1844,1276,"u",""],
    ["world","Dorian Greyning portreti","The Picture of Dorian Gray","Портрет Дориана Грея","Oscar Wilde",1890,272,"u",""],
    ["world","Varrak uchiruvchi","The Kite Runner","Бегущий за ветром","Khaled Hosseini",2003,384,"u","b"],

    // ---------- Diniy-ma'rifiy ----------
    ["religion","Qur’oni Karim ma’nolarining tarjimasi","The Holy Quran: Translation of Meanings","Священный Коран: перевод смыслов","Abdulaziz Mansur",2001,640,"u","b"],
    ["religion","Al-Jome’ as-sahih","Sahih al-Bukhari","Сахих аль-Бухари","Imom al-Buxoriy",846,1200,"u","b"],
    ["religion","Riyozus solihin","Riyad as-Salihin","Сады праведных","Imom an-Navaviy",1270,720,"u",""],
    ["religion","Al-adab al-mufrad","Al-Adab al-Mufrad","Аль-Адаб аль-Муфрад","Imom al-Buxoriy",840,480,"u",""],
    ["religion","Sunani Termiziy","Jami' at-Tirmidhi","Сунан ат-Тирмизи","Imom at-Termiziy",884,960,"u",""],
    ["religion","Muhrlangan sharob (Ar-Rahiq al-maxtum)","The Sealed Nectar","Запечатанный нектар","Safiyurrahmon Muborakpuriy",1979,576,"u",""],
    ["religion","Tafsiri Hilol","Tafsir Hilal","Тафсир Хилал","Shayx Muhammad Sodiq Muhammad Yusuf",2008,800,"u","b"],
    ["religion","Hadis va hayot","Hadith and Life","Хадис и жизнь","Shayx Muhammad Sodiq Muhammad Yusuf",2010,384,"u",""],
    ["religion","Ihyou ulumid-din","The Revival of the Religious Sciences","Воскрешение наук о вере","Imom G‘azzoliy",1100,960,"u",""],
    ["religion","Masnaviy","The Masnavi","Маснави","Jaloliddin Rumiy",1273,640,"u",""],
    ["religion","Devoni hikmat","Book of Wisdom","Диван-и Хикмет","Ahmad Yassaviy",1166,256,"u",""],
    ["religion","Muhammad (s.a.v.): eng qadimgi manbalar asosida","Muhammad: His Life Based on the Earliest Sources","Жизнеописание пророка Мухаммада","Martin Lings",1983,384,"r",""],
    ["religion","G‘am chekma","Don't Be Sad","Не печалься","Oiz al-Qarniy",2002,480,"u","b"],
    ["religion","Aqidatut-Tahoviya","Al-Aqida at-Tahawiyya","Акида ат-Тахавия","Imom at-Tahoviy",930,160,"u",""],
    ["religion","Kitob at-tavhid","Kitab at-Tawhid","Китаб ат-Таухид","Abu Mansur al-Moturidiy",944,480,"u",""],
    ["religion","Guliston","Gulistan","Гулистан","Sa’diy Sheroziy",1258,288,"u",""],
    ["religion","Bo‘ston","Bustan","Бустан","Sa’diy Sheroziy",1257,320,"u",""],
    ["religion","Mantiq ut-tayr","The Conference of the Birds","Беседа птиц","Fariduddin Attor",1177,448,"u",""],

    // ---------- Ta'lim va darsliklar ----------
    ["education","English Grammar in Use","English Grammar in Use","English Grammar in Use","Raymond Murphy",1985,380,"e","b"],
    ["education","Essential Grammar in Use","Essential Grammar in Use","Essential Grammar in Use","Raymond Murphy",1990,320,"e",""],
    ["education","Oxford ilg‘or o‘quvchi lug‘ati","Oxford Advanced Learner's Dictionary","Оксфордский словарь для продвинутых","A.S. Hornby",1948,1952,"e",""],
    ["education","IELTS bo‘yicha rasmiy Cambridge qo‘llanmasi","The Official Cambridge Guide to IELTS","Официальное руководство Cambridge по IELTS","Pauline Cullen",2014,512,"e","b"],
    ["education","So‘z boyligi oson yo‘l bilan","Word Power Made Easy","Word Power Made Easy","Norman Lewis",1949,528,"e",""],
    ["education","Oliygohga kiruvchilar uchun matematika masalalari","Problems in Mathematics for University Applicants","Сборник задач по математике для поступающих во втузы","M.I. Skanavi",1988,608,"r",""],
    ["education","Umumiy fizikadan masalalar","Problems in General Physics","Задачи по общей физике","I.E. Irodov",1979,416,"r",""],
    ["education","Kimyo: markaziy fan","Chemistry: The Central Science","Химия: центральная наука","Theodore L. Brown",1977,1248,"e",""],
    ["education","Campbell biologiyasi","Campbell Biology","Биология Кэмпбелла","Lisa A. Urry",1987,1488,"e",""],
    ["education","Yo‘l harakati qoidalari","Traffic Rules of the Republic of Uzbekistan","Правила дорожного движения Республики Узбекистан","O‘zbekiston Respublikasi",2024,128,"u","bn"],
    ["education","Esda qolsin: o‘rganish ilmi","Make It Stick","Запомнить всё","Peter C. Brown",2014,336,"r",""],
    ["education","Kitobni qanday o‘qish kerak","How to Read a Book","Как читать книги","Mortimer J. Adler",1940,426,"r",""],
    ["education","Har qanday tilni ravon o‘rganish","Fluent Forever","Как выучить любой язык","Gabriel Wyner",2014,336,"r",""],
    ["education","Matematik kabi fikrlang","A Mind for Numbers","Думай как математик","Barbara Oakley",2014,336,"r",""],
    ["education","Cambridge IELTS 18","Cambridge IELTS 18","Cambridge IELTS 18","Cambridge University Press",2023,144,"e","n"],
    ["education","SAT’ga tayyorgarlik","Barron's SAT","Barron's SAT","Sharon Weiner Green",2023,960,"e","n"],
    ["education","Ultra-o‘rganish","Ultralearning","Метод ультраобучения","Scott H. Young",2019,304,"r",""],
    ["education","Uslub elementlari","The Elements of Style","Элементы стиля","William Strunk Jr., E.B. White",1959,105,"e",""],

    // ---------- Biografiya ----------
    ["biography","Stiv Jobs","Steve Jobs","Стив Джобс","Walter Isaacson",2011,656,"u","b"],
    ["biography","Ilon Mask","Elon Musk","Илон Маск","Walter Isaacson",2023,688,"u","bn"],
    ["biography","Eynshteyn: hayoti va olami","Einstein: His Life and Universe","Эйнштейн. Жизнь и Вселенная","Walter Isaacson",2007,704,"r",""],
    ["biography","Leonardo da Vinchi","Leonardo da Vinci","Леонардо да Винчи","Walter Isaacson",2017,624,"r",""],
    ["biography","Erkinlikka uzoq yo‘l","Long Walk to Freedom","Долгий путь к свободе","Nelson Mandela",1994,656,"r",""],
    ["biography","Men — Malola","I Am Malala","Я — Малала","Malala Yousafzai",2013,352,"u",""],
    ["biography","Mening hikoyam","Becoming","Becoming. Моя история","Michelle Obama",2018,448,"r",""],
    ["biography","Ta’lim olgan qiz","Educated","Ученица","Tara Westover",2018,352,"r",""],
    ["biography","Haqiqat bilan tajribalarim tarixi","The Story of My Experiments with Truth","Моя жизнь. Мои эксперименты с истиной","Mahatma Gandhi",1927,528,"r",""],
    ["biography","Benjamin Franklin","Benjamin Franklin: An American Life","Бенджамин Франклин","Walter Isaacson",2003,608,"e",""],
    ["biography","Malkolm Iksning tarjimai holi","The Autobiography of Malcolm X","Автобиография Малкольма Икса","Malcolm X, Alex Haley",1965,496,"e",""],
    ["biography","Nafas havoga aylanganda","When Breath Becomes Air","Когда дыхание растворяется в воздухе","Paul Kalanithi",2016,256,"r",""],
    ["biography","Navoiy","Navoi","Навои","Oybek",1944,440,"u","b"],
    ["biography","Temur: Islom qilichi, jahon fotihi","Tamerlane: Sword of Islam, Conqueror of the World","Тамерлан. Меч ислама, завоеватель мира","Justin Marozzi",2004,480,"r",""],
    ["biography","Napoleon","Napoleon: A Life","Наполеон","Andrew Roberts",2014,976,"r",""],
    ["biography","Cherchill","Churchill: Walking with Destiny","Черчилль. Путь к судьбе","Andrew Roberts",2018,1152,"e",""],
    ["biography","Ochiq","Open","Открытый. Автобиография","Andre Agassi",2009,400,"r",""],
    ["biography","Foydali bo‘l","Be Useful","Будь полезен","Arnold Schwarzenegger",2023,288,"r","n"]
  ];

  // Deterministik (har safar bir xil) qiymatlar — server va brauzer bir xil narxni hisoblashi shart.
  function seeded(n, mod) { return ((n * 2654435761) >>> 0) % mod; }

  var catMap = {};
  CATEGORIES.forEach(function (c) { catMap[c.id] = c; });

  var BOOKS = RAW.map(function (r, i) {
    var id = i + 1;
    var cat = catMap[r[0]];
    var pages = r[6];
    // Narx: kategoriya bazasi + hajmga qarab qo'shimcha + kichik farq, 1000 so'mga yaxlitlangan
    var price = cat.base + Math.min(Math.floor(pages / 100), 10) * 6000 + seeded(id, 7) * 4000;
    price = Math.round(price / 1000) * 1000;
    var discount = (id % 5 === 0 || id % 11 === 0) ? [10, 15, 20, 25][seeded(id, 4)] : 0;
    var oldPrice = 0;
    if (discount) {
      oldPrice = price;
      price = Math.round((price * (100 - discount) / 100) / 1000) * 1000;
    }
    var flags = r[8] || "";
    return {
      id: id,
      category: r[0],
      title: { uz: r[1], en: r[2], ru: r[3] },
      author: r[4],
      year: r[5],
      pages: pages,
      language: { u: "uz", e: "en", r: "ru" }[r[7]],
      price: price,
      oldPrice: oldPrice,
      discount: discount,
      rating: Math.round((4 + seeded(id, 10) / 10) * 10) / 10, // 4.0 – 4.9
      reviews: 12 + seeded(id, 480),
      stock: id % 37 === 0 ? 0 : 3 + seeded(id, 45),
      bestseller: flags.indexOf("b") !== -1,
      isNew: flags.indexOf("n") !== -1 || r[5] >= 2021,
      popularity: seeded(id, 1000) + (flags.indexOf("b") !== -1 ? 1000 : 0)
    };
  });

  var data = { BOOKS: BOOKS, CATEGORIES: CATEGORIES };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = data; // Netlify Function (Node.js)
  } else {
    root.ZV = root.ZV || {};
    root.ZV.BOOKS = BOOKS;
    root.ZV.CATEGORIES = CATEGORIES;
  }
})(typeof window !== "undefined" ? window : globalThis);
