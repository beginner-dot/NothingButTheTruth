export type SourceLog = {
  source: "KJV" | "Ellen White" | "Pioneer";
  citation: string;
  excerpt: string;
};

export type ReadingResource = {
  title: string;
  chapters: string;
  pages: string;
  link: string;
};

export type ScriptureResource = {
  reference: string;
  link: string;
};

export type TeacherLesson = {
  title: string;
  content: string;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
};

export type Module = {
  id: number;
  title: string;
  narrative: string;
  requiredReading: ReadingResource[];
  scriptureLinks: ScriptureResource[];
  teacherLessons: TeacherLesson[];
  logs: SourceLog[];
  diagnostic: DiagnosticQuestion[];
};

export const studySystem: Module[] = [
  {
    id: 1,
    title: "Module 1 · The Beginning of the Great Controversy",
    narrative:
      "This module lays the foundation for everything that follows. The central issue in Scripture is not whether God has power, but whether His character is trustworthy. The origin of sin, the fall of Lucifer, and the spread of rebellion reveal that evil began as a lie about God’s love and law.",
    requiredReading: [
      {
        title: "Patriarchs and Prophets",
        chapters: "1-4",
        pages: "33-52",
        link: "https://egwwritings.org/read?panels=p84.164",
      },
      {
        title: "The Great Controversy",
        chapters: "Introduction",
        pages: "vii-xii",
        link: "https://egwwritings.org/read?panels=p132.5",
      },
      {
        title: "Uriah Smith: Daniel and the Revelation",
        chapters: "Revelation 12",
        pages: "533-545",
        link: "https://archive.org/details/danielandrevelat00smit/page/533/mode/2up",
      },
    ],
    scriptureLinks: [
      {
        reference: "Isaiah 14:12-14",
        link: "https://www.biblegateway.com/passage/?search=Isaiah+14%3A12-14&version=KJV",
      },
      {
        reference: "Ezekiel 28:12-17",
        link: "https://www.biblegateway.com/passage/?search=Ezekiel+28%3A12-17&version=KJV",
      },
      {
        reference: "Revelation 12:7-9",
        link: "https://www.biblegateway.com/passage/?search=Revelation+12%3A7-9&version=KJV",
      },
      {
        reference: "John 8:44",
        link: "https://www.biblegateway.com/passage/?search=John+8%3A44&version=KJV",
      },
      {
        reference: "1 John 3:8",
        link: "https://www.biblegateway.com/passage/?search=1+John+3%3A8&version=KJV",
      },
    ],
    teacherLessons: [
      {
        title: "Lesson 1 · Sin Began as Distrust, Not as Weakness in God",
        content:
          "Lucifer’s rebellion started in a perfect environment. That means sin did not begin because heaven lacked justice, truth, or joy. It began when a created being chose self-exaltation over worship. Scripture presents this as a heart-level problem: pride, jealousy, and a desire to replace God. This is why the Great Controversy is deeply personal. Every generation must answer the same question: will we trust God’s character, or the serpent’s accusations? The cross reveals the answer. Christ did not defeat evil by force alone; He revealed the love and righteousness of God in public view before heaven and earth.",
      },
      {
        title: "Lesson 2 · Why This Module Matters for Daily Christian Life",
        content:
          "If evil began as deception, then spiritual growth begins with truth. Believers need more than behavior correction; we need a renewed view of God. Many struggles—fear, shame, legalism, bitterness—grow from wrong ideas about God’s heart. This module teaches that obedience and faith are not enemies. God’s law protects life because it reflects His love. Prayer, Scripture study, and repentance are not religious tasks to earn favor, but ways to live in the reality of God’s government. The reader should leave this module understanding that the battle is about allegiance, worship, and witness.",
      },
    ],
    logs: [
      {
        source: "KJV",
        citation: "Isaiah 14:12-14",
        excerpt:
          "How art thou fallen from heaven, O Lucifer... For thou hast said in thine heart, I will ascend into heaven... I will be like the most High.",
      },
      {
        source: "KJV",
        citation: "Ezekiel 28:14-15",
        excerpt:
          "Thou art the anointed cherub that covereth... Thou wast perfect in thy ways from the day that thou wast created, till iniquity was found in thee.",
      },
      {
        source: "KJV",
        citation: "Revelation 12:7-9",
        excerpt:
          "And there was war in heaven... that old serpent, called the Devil, and Satan... cast out into the earth.",
      },
      {
        source: "Ellen White",
        citation: "Patriarchs and Prophets, ch. 1",
        excerpt:
          "Little by little Lucifer came to indulge the desire for self-exaltation... and sought to secure allegiance to himself.",
      },
      {
        source: "Pioneer",
        citation: "Uriah Smith, Daniel and the Revelation (Rev. 12)",
        excerpt:
          "The opening conflict in heaven explains the later conflict on earth; prophecy tracks one continuous controversy.",
      },
    ],
    diagnostic: [
      {
        id: "m1q1",
        prompt: "Why is it theologically important that sin began in a perfect heaven?",
        options: [
          "It proves God authored sin so prophecy could be fulfilled",
          "It shows sin is rooted in free moral choice, not in a defect in God’s government",
          "It means angels were biologically weaker than Satan",
          "It confirms human law is the source of evil",
        ],
        answer: 1,
      },
      {
        id: "m1q2",
        prompt: "Which passage most directly narrates the expulsion of Satan from heaven?",
        options: ["Leviticus 16", "Revelation 12:7-9", "Daniel 9:24-27", "Acts 2"],
        answer: 1,
      },
      {
        id: "m1q3",
        prompt: "In this module, what is the core issue of the Great Controversy?",
        options: [
          "A political transfer of angels between kingdoms",
          "A dispute over ceremony without moral implications",
          "God’s character, law, and right to rule",
          "A conflict only about earthly prosperity",
        ],
        answer: 2,
      },
      {
        id: "m1q4",
        prompt: "Which statement best matches the relation between truth and freedom in this lesson?",
        options: [
          "Freedom grows when truth is ignored",
          "Truth is optional because love is enough",
          "Freedom is preserved when creatures choose trust in God’s truth",
          "Freedom is strongest under deception",
        ],
        answer: 2,
      },
      {
        id: "m1q5",
        prompt: "How does the cross answer Satan’s accusations in Great Controversy theology?",
        options: [
          "By canceling the need for God’s justice",
          "By proving coercion is God’s main method",
          "By revealing both God’s justice and self-giving love before the universe",
          "By replacing Scripture with church tradition",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Module 2 · The Prophetic Timeline of the Messiah",
    narrative:
      "This module teaches how prophecy anchors faith in real history. Daniel 9 is not a vague symbol; it is a measurable timeline from the decree to restore Jerusalem to the ministry and sacrifice of Christ. Readers learn to trace Scripture with confidence and avoid careless date-setting.",
    requiredReading: [
      {
        title: "The Desire of Ages",
        chapters: "18, 20, 36",
        pages: "231-234; 247-252; 327-333",
        link: "https://egwwritings.org/read?panels=p130.1114",
      },
      {
        title: "Uriah Smith: Daniel and the Revelation",
        chapters: "Daniel 9",
        pages: "191-214",
        link: "https://archive.org/details/danielandrevelat00smit/page/191/mode/2up",
      },
      {
        title: "Bible Commentary Reading",
        chapters: "Ezra 7; Daniel 8-9",
        pages: "Entire chapter study",
        link: "https://www.biblegateway.com/passage/?search=Ezra+7%2C+Daniel+8-9&version=KJV",
      },
    ],
    scriptureLinks: [
      {
        reference: "Daniel 9:24-27",
        link: "https://www.biblegateway.com/passage/?search=Daniel+9%3A24-27&version=KJV",
      },
      {
        reference: "Ezra 7:11-26",
        link: "https://www.biblegateway.com/passage/?search=Ezra+7%3A11-26&version=KJV",
      },
      {
        reference: "Luke 3:1,21-23",
        link: "https://www.biblegateway.com/passage/?search=Luke+3%3A1%2C21-23&version=KJV",
      },
      {
        reference: "Mark 15:37-38",
        link: "https://www.biblegateway.com/passage/?search=Mark+15%3A37-38&version=KJV",
      },
      {
        reference: "Galatians 4:4",
        link: "https://www.biblegateway.com/passage/?search=Galatians+4%3A4&version=KJV",
      },
    ],
    teacherLessons: [
      {
        title: "Lesson 1 · Prophecy as Evidence, Not Guesswork",
        content:
          "The 70-week prophecy demonstrates that biblical prophecy can be tested in history. The decree in Ezra 7 establishes a concrete starting point, and the timeline reaches the appearance and ministry of Christ with remarkable precision. This should shape how believers study all prophecy: with humility, careful reading, and historical accountability. We do not invent dates to force events into our views; we allow the text to define the timeline and compare it with verifiable history.",
      },
      {
        title: "Lesson 2 · Why the Timeline Deepens Trust in Christ",
        content:
          "When readers see that Christ arrives at the appointed time, faith moves from emotion to conviction. The gospel is not mythology; it is God acting in history. Daniel 9 connects covenant, atonement, and mission. Christ is anointed, Christ is cut off, and mercy still extends to the nations. This module calls the student to see prophecy as pastoral truth: God keeps His word, prepares His people, and calls us to mission with urgency and hope.",
      },
    ],
    logs: [
      {
        source: "KJV",
        citation: "Daniel 9:24-27",
        excerpt:
          "Seventy weeks are determined... from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince...",
      },
      {
        source: "KJV",
        citation: "Ezra 7:11-26",
        excerpt:
          "Artaxerxes’ decree provides civil and judicial restoration authority, establishing the launch point.",
      },
      {
        source: "KJV",
        citation: "Galatians 4:4",
        excerpt: "When the fulness of the time was come, God sent forth his Son.",
      },
      {
        source: "Ellen White",
        citation: "The Desire of Ages, ch. 18",
        excerpt:
          "The very time of Christ’s baptism and anointing had been clearly specified by prophecy.",
      },
      {
        source: "Pioneer",
        citation: "Uriah Smith, Daniel and the Revelation (Dan. 9)",
        excerpt:
          "The 70 weeks are cut off for the Jewish nation, beginning at the decree and terminating with gospel transition.",
      },
    ],
    diagnostic: [
      {
        id: "m2q1",
        prompt: "Why is Ezra 7 treated as the preferred starting point for the 70 weeks in this study?",
        options: [
          "It marks both religious and civil authority for restoration, matching Daniel’s wording",
          "It is simply the earliest Persian date",
          "It appears first in the New Testament",
          "It removes the need for Christ’s baptism in the timeline",
        ],
        answer: 0,
      },
      {
        id: "m2q2",
        prompt: "In this module’s framework, what event fulfills the middle of the seventieth week?",
        options: [
          "The destruction of Jerusalem in AD 70",
          "The death of Jesus on the cross",
          "Pentecost in AD 34",
          "The decree of Cyrus",
        ],
        answer: 1,
      },
      {
        id: "m2q3",
        prompt: "Why does this module identify AD 34 as the close of the 70 weeks?",
        options: [
          "It marks the end of all gospel mission",
          "It represents the transition from a nation-centered probation period to broader mission",
          "It is the date of Christ’s resurrection",
          "It is the beginning of the Babylonian exile",
        ],
        answer: 1,
      },
      {
        id: "m2q4",
        prompt: "Which method best protects against misusing prophecy?",
        options: [
          "Using only modern headlines",
          "Ignoring Old Testament context",
          "Combining textual context, historical markers, and cross-references",
          "Treating all numbers as symbolic",
        ],
        answer: 2,
      },
      {
        id: "m2q5",
        prompt: "What is the practical spiritual purpose of this timeline module?",
        options: [
          "To prove salvation depends on date calculations",
          "To show that God keeps covenant promises and calls people to mission",
          "To replace the gospel with chronology",
          "To make personal repentance unnecessary",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Module 3 · Moral Law and Ceremonial Law",
    narrative:
      "This module resolves one of the most common Bible study confusions: which laws are permanent moral principles and which were temporary ceremonial shadows. Students examine Scripture locations, function, and fulfillment to avoid legalism on one side and lawlessness on the other.",
    requiredReading: [
      {
        title: "The Great Controversy",
        chapters: "25",
        pages: "433-450",
        link: "https://egwwritings.org/read?panels=p132.1945",
      },
      {
        title: "Patriarchs and Prophets",
        chapters: "27, 32",
        pages: "303-314; 364-373",
        link: "https://egwwritings.org/read?panels=p84.1457",
      },
      {
        title: "Uriah Smith: Law Themes",
        chapters: "Daniel and Revelation notes",
        pages: "selected",
        link: "https://archive.org/details/danielandrevelat00smit",
      },
    ],
    scriptureLinks: [
      {
        reference: "Exodus 31:18",
        link: "https://www.biblegateway.com/passage/?search=Exodus+31%3A18&version=KJV",
      },
      {
        reference: "Deuteronomy 31:24-26",
        link: "https://www.biblegateway.com/passage/?search=Deuteronomy+31%3A24-26&version=KJV",
      },
      {
        reference: "Romans 3:31",
        link: "https://www.biblegateway.com/passage/?search=Romans+3%3A31&version=KJV",
      },
      {
        reference: "Colossians 2:14-17",
        link: "https://www.biblegateway.com/passage/?search=Colossians+2%3A14-17&version=KJV",
      },
      {
        reference: "Hebrews 10:1",
        link: "https://www.biblegateway.com/passage/?search=Hebrews+10%3A1&version=KJV",
      },
    ],
    teacherLessons: [
      {
        title: "Lesson 1 · Distinction Without Division",
        content:
          "Scripture does not pit law against grace. Instead, it presents different categories of law with different purposes. The moral law reveals God’s character and defines sin. The ceremonial system was a teaching instrument, pointing forward to Christ’s sacrifice and priestly work. Confusion happens when believers erase these distinctions. If all law is abolished, sin loses definition. If all law remains in ceremonial form, the cross loses fulfillment. Sound Bible study keeps what Scripture keeps and fulfills what Scripture says is fulfilled.",
      },
      {
        title: "Lesson 2 · Pastoral Application for Church Life",
        content:
          "Many church conflicts come from collapsing categories. Some believers fear obedience means legalism. Others fear grace means compromise. This module teaches a healthier path: we are saved by grace through faith, and the same grace writes God’s moral law in the heart. Ceremonial shadows pointed to Christ and reached their goal in Him. Moral truth still guides discipleship, family life, ethics, worship, and mission. A mature believer holds both gospel assurance and moral seriousness together.",
      },
    ],
    logs: [
      {
        source: "KJV",
        citation: "Exodus 31:18",
        excerpt: "The testimony was written with the finger of God upon tables of stone.",
      },
      {
        source: "KJV",
        citation: "Deuteronomy 31:24-26",
        excerpt: "The book of the law was placed in the side of the ark as a witness.",
      },
      {
        source: "KJV",
        citation: "Colossians 2:14",
        excerpt:
          "Blotting out the handwriting of ordinances that was against us... nailing it to his cross.",
      },
      {
        source: "Ellen White",
        citation: "The Great Controversy, ch. 25",
        excerpt:
          "The law of God in the sanctuary in heaven is the great original, of which the precepts... were an unerring transcript.",
      },
      {
        source: "Pioneer",
        citation: "Uriah Smith, Daniel and the Revelation (Law themes)",
        excerpt:
          "Prophetic interpretation keeps distinct the perpetual moral law and temporary ceremonial enactments.",
      },
    ],
    diagnostic: [
      {
        id: "m3q1",
        prompt:
          "Which conclusion best reflects this module’s distinction between moral and ceremonial law?",
        options: [
          "Both were temporary symbols",
          "Moral law reflects God’s character; ceremonial law pointed forward to Christ",
          "Moral law ended at Sinai; ceremonial law remains",
          "Neither law has present-day teaching value",
        ],
        answer: 1,
      },
      {
        id: "m3q2",
        prompt: "In the context of Colossians 2:14-17, what is presented as removed at the cross?",
        options: [
          "The character of God",
          "The Sabbath command",
          "The handwriting of ordinances",
          "All prophetic timelines",
        ],
        answer: 2,
      },
      {
        id: "m3q3",
        prompt: "Why does placement language (inside vs side of the ark) matter in this study?",
        options: [
          "It identifies different covenant functions in the biblical witness",
          "It proves geography is the main point of salvation",
          "It cancels New Testament theology",
          "It removes the need for Christ’s priesthood",
        ],
        answer: 0,
      },
      {
        id: "m3q4",
        prompt: "Which pastoral danger appears when moral law is denied?",
        options: [
          "People take holiness seriously",
          "Sin becomes undefined and discipleship becomes subjective",
          "Christ’s atonement is better understood",
          "Biblical ethics becomes clearer",
        ],
        answer: 1,
      },
      {
        id: "m3q5",
        prompt: "How should grace and obedience relate according to this module?",
        options: [
          "Grace saves, and obedience is the Spirit-enabled fruit of faith",
          "Obedience saves, and grace is optional",
          "Grace and obedience are opposites",
          "Neither grace nor obedience matters after baptism",
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 4,
    title: "Module 4 · Understanding the Sanctuary Service",
    narrative:
      "This module helps the learner read sanctuary imagery as a gospel teaching system: sacrifice, mediation, cleansing, and final restoration. The sanctuary does not compete with the cross; it explains the full ministry of Christ from atonement to final judgment.",
    requiredReading: [
      {
        title: "The Great Controversy",
        chapters: "23, 24",
        pages: "409-432",
        link: "https://egwwritings.org/read?panels=p132.1820",
      },
      {
        title: "Patriarchs and Prophets",
        chapters: "30",
        pages: "343-358",
        link: "https://egwwritings.org/read?panels=p84.1561",
      },
      {
        title: "Daniel and the Revelation",
        chapters: "Daniel 8:14",
        pages: "167-190",
        link: "https://archive.org/details/danielandrevelat00smit/page/167/mode/2up",
      },
    ],
    scriptureLinks: [
      {
        reference: "Leviticus 4:27-31",
        link: "https://www.biblegateway.com/passage/?search=Leviticus+4%3A27-31&version=KJV",
      },
      {
        reference: "Leviticus 16:16, 21-22, 30",
        link: "https://www.biblegateway.com/passage/?search=Leviticus+16%3A16%2C21-22%2C30&version=KJV",
      },
      {
        reference: "Hebrews 8:1-2",
        link: "https://www.biblegateway.com/passage/?search=Hebrews+8%3A1-2&version=KJV",
      },
      {
        reference: "Hebrews 9:23-28",
        link: "https://www.biblegateway.com/passage/?search=Hebrews+9%3A23-28&version=KJV",
      },
      {
        reference: "Daniel 8:14",
        link: "https://www.biblegateway.com/passage/?search=Daniel+8%3A14&version=KJV",
      },
    ],
    teacherLessons: [
      {
        title: "Lesson 1 · Daily and Yearly Services in Salvation History",
        content:
          "The daily services taught confession, substitution, and priestly mediation. The yearly Day of Atonement taught corporate accountability, cleansing, and final separation from sin. Together they form a complete theology of salvation: justification, sanctification, and judgment. The sanctuary shows that forgiveness is not God ignoring evil; it is God dealing with evil truthfully and mercifully through Christ.",
      },
      {
        title: "Lesson 2 · Christ’s Ongoing Ministry and Christian Assurance",
        content:
          "Many believers trust Christ’s death but rarely think about His ongoing priestly ministry. Hebrews presents Christ as active now—interceding, cleansing, and preparing a people for His return. This gives both assurance and urgency. Assurance, because our Advocate is faithful. Urgency, because judgment language calls us to repentance, integrity, and mission. Sanctuary theology should produce hope-filled obedience, not fear-driven religion.",
      },
    ],
    logs: [
      {
        source: "KJV",
        citation: "Leviticus 4:27-29",
        excerpt: "The sinner lays hand on the offering, confessing sin over the substitute.",
      },
      {
        source: "KJV",
        citation: "Leviticus 16:16, 21-22",
        excerpt:
          "Atonement is made because of transgressions; confessed sins are placed and carried away.",
      },
      {
        source: "KJV",
        citation: "Hebrews 8:1-2",
        excerpt: "We have such an high priest... a minister of the sanctuary, and of the true tabernacle.",
      },
      {
        source: "Ellen White",
        citation: "The Great Controversy, ch. 23",
        excerpt:
          "As anciently the sins of the people were by faith placed upon the sin offering... so in the new covenant they are by faith placed upon Christ.",
      },
      {
        source: "Pioneer",
        citation: "Uriah Smith, Daniel and the Revelation (Dan. 8:14)",
        excerpt:
          "The cleansing of the sanctuary concerns the final resolution of the sin record in heaven’s judgment.",
      },
    ],
    diagnostic: [
      {
        id: "m4q1",
        prompt: "What does confession over a sacrificial offering teach in Leviticus 4?",
        options: [
          "Ordination only",
          "Symbolic transfer of confessed sin to the substitute",
          "Blessing without confession",
          "Selection of feast days",
        ],
        answer: 1,
      },
      {
        id: "m4q2",
        prompt: "Why is Hebrews central for this module’s understanding of the sanctuary?",
        options: [
          "It denies priestly ministry",
          "It presents Christ as High Priest in the true heavenly sanctuary",
          "It teaches ritual salvation by works",
          "It removes the cross from redemption",
        ],
        answer: 1,
      },
      {
        id: "m4q3",
        prompt: "The Day of Atonement most strongly prefigures which idea in this lesson?",
        options: [
          "Daily worship only",
          "A final judgment and cleansing work in God’s redemptive plan",
          "The tower of Babel",
          "The Exodus plagues",
        ],
        answer: 1,
      },
      {
        id: "m4q4",
        prompt: "Which statement avoids the false contrast between cross and sanctuary?",
        options: [
          "The sanctuary replaces the cross",
          "The cross saves; sanctuary ministry applies and completes redemption history",
          "Only the earthly sanctuary matters",
          "The sanctuary is unrelated to Christ",
        ],
        answer: 1,
      },
      {
        id: "m4q5",
        prompt: "What is the healthiest response to judgment truth according to this module?",
        options: [
          "Fear and withdrawal from mission",
          "Moral indifference because grace is enough",
          "Hope-filled repentance, assurance in Christ, and faithful witness",
          "Replacing prayer with ritual",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 5,
    title: "Module 5 · System Restore",
    narrative:
      "This module traces the historical drift from apostolic faith and the later restoration movement that called believers back to Scripture. The purpose is not triumphalism, but faithfulness: to understand how truth can be lost, recovered, and lived in the last days.",
    requiredReading: [
      {
        title: "The Great Controversy",
        chapters: "3, 4, 35-39",
        pages: "49-78; 563-678",
        link: "https://egwwritings.org/read?panels=p132.255",
      },
      {
        title: "Uriah Smith: Daniel and the Revelation",
        chapters: "Revelation 13-14",
        pages: "613-705",
        link: "https://archive.org/details/danielandrevelat00smit/page/613/mode/2up",
      },
      {
        title: "Church History Reader",
        chapters: "Apostolic era to Reformation",
        pages: "selected",
        link: "https://archive.org/details/historyofchristi0000gonz",
      },
    ],
    scriptureLinks: [
      {
        reference: "2 Thessalonians 2:3-4",
        link: "https://www.biblegateway.com/passage/?search=2+Thessalonians+2%3A3-4&version=KJV",
      },
      {
        reference: "Revelation 12:17",
        link: "https://www.biblegateway.com/passage/?search=Revelation+12%3A17&version=KJV",
      },
      {
        reference: "Revelation 14:6-12",
        link: "https://www.biblegateway.com/passage/?search=Revelation+14%3A6-12&version=KJV",
      },
      {
        reference: "Acts 20:29-30",
        link: "https://www.biblegateway.com/passage/?search=Acts+20%3A29-30&version=KJV",
      },
      {
        reference: "2 Timothy 3:16-17",
        link: "https://www.biblegateway.com/passage/?search=2+Timothy+3%3A16-17&version=KJV",
      },
    ],
    teacherLessons: [
      {
        title: "Lesson 1 · Falling Away and Restoration in Church History",
        content:
          "Scripture predicts both apostasy and restoration. History confirms this pattern: truth is often obscured by power, tradition, and compromise; yet God repeatedly raises witnesses who call His people back to the Word. This lesson invites careful, humble study of Christian history, not to condemn believers of the past, but to understand how spiritual drift happens. Every generation must choose whether Scripture or custom will have final authority.",
      },
      {
        title: "Lesson 2 · Remnant Identity as Mission, Not Pride",
        content:
          "Remnant language in Revelation is missional before it is institutional. The remnant are described by faithfulness to God and loyalty to Jesus, not by self-congratulation. The final message goes to every nation, kindred, tongue, and people. The purpose of restored truth is service: proclaiming the everlasting gospel, calling people to worship the Creator, and preparing hearts for Christ’s return with compassion, courage, and biblical clarity.",
      },
    ],
    logs: [
      {
        source: "KJV",
        citation: "2 Thessalonians 2:3",
        excerpt: "That day shall not come, except there come a falling away first.",
      },
      {
        source: "KJV",
        citation: "Revelation 12:17",
        excerpt:
          "The remnant... keep the commandments of God, and have the testimony of Jesus Christ.",
      },
      {
        source: "KJV",
        citation: "Revelation 14:6-12",
        excerpt:
          "The final message calls all nations to worship the Creator and keep the faith of Jesus.",
      },
      {
        source: "Ellen White",
        citation: "The Great Controversy, Introduction/closing themes",
        excerpt:
          "In the closing conflict, every institution and doctrine will be tested by the Scriptures.",
      },
      {
        source: "Pioneer",
        citation: "Uriah Smith, Daniel and the Revelation (Rev. 14)",
        excerpt:
          "The remnant proclamation is heaven’s final call to restore Bible truth before Christ returns.",
      },
    ],
    diagnostic: [
      {
        id: "m5q1",
        prompt: "According to this module, what is the most accurate summary of post-apostolic history?",
        options: [
          "Immediate universal faithfulness",
          "A foretold falling away",
          "No change in doctrine",
          "End of prophetic relevance",
        ],
        answer: 1,
      },
      {
        id: "m5q2",
        prompt: "What qualifies as remnant identity in Revelation 12:17 as presented here?",
        options: [
          "Political dominance",
          "Miraculous wealth",
          "Commandment keeping and testimony of Jesus",
          "Temple sacrifices in Jerusalem",
        ],
        answer: 2,
      },
      {
        id: "m5q3",
        prompt: "How does this study frame 1844?",
        options: [
          "End of Scripture",
          "A key milestone in the restoration of Bible truth",
          "Start of Roman Empire",
          "Date of Sinai",
        ],
        answer: 1,
      },
      {
        id: "m5q4",
        prompt: "Which attitude best matches the module’s teaching on restored truth?",
        options: [
          "Prideful exclusivism",
          "Missional humility grounded in Scripture",
          "Historical denial",
          "Disinterest in evangelism",
        ],
        answer: 1,
      },
      {
        id: "m5q5",
        prompt: "Why does this module insist on both gospel proclamation and obedience?",
        options: [
          "Because law can save without Christ",
          "Because faith in Jesus and covenant faithfulness belong together in Revelation’s final message",
          "Because doctrine is optional if mission is active",
          "Because church history replaces biblical authority",
        ],
        answer: 1,
      },
    ],
  },
];
