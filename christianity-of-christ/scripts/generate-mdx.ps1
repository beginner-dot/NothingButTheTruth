$modules = @(
  @{Id='module-0'; Title='Introduction to the Christianity of Christ'; Minutes=20; Scriptures='Matthew 4:1-11; John 13:34-35; John 15:1-5'; EGW='The Desire of Ages, public-domain excerpt placeholder'; Hist='Early Christians identified themselves as followers of the risen Christ before they were called by broader social labels. Their communal life centered on prayer, Scripture, service, and witness. Public-domain historical records show Christ-shaped discipleship as their practical identity.'},
  @{Id='module-1'; Title='Christ as the First Christian'; Minutes=45; Scriptures='Luke 2:40-52; John 5:19; 1 Peter 2:21'; EGW='The Desire of Ages, chapter references placeholder'; Hist='The apostolic church understood Christian identity as conformity to Christ. Their preaching emphasized not merely belief about Jesus, but participation in His life through faith and obedience by the Spirit.'},
  @{Id='module-2'; Title='Christs Prayer Life and Communion with the Father'; Minutes=40; Scriptures='Mark 1:35; Luke 6:12; John 17'; EGW='Steps to Christ and Desire of Ages prayer excerpts placeholder'; Hist='Public-domain Christian writings frequently describe Jesus as the pattern of continual dependence on the Father. Prayer was considered both devotional and missional preparation.'},
  @{Id='module-3'; Title='Christs Relationship to Scripture'; Minutes=40; Scriptures='Matthew 4:4; Luke 24:27; John 17:17'; EGW='Christs Object Lessons Scripture emphasis placeholder'; Hist='Early Christian catechesis used the Hebrew Scriptures read through the life and mission of Christ. Scripture was treated as formative authority for doctrine and daily life.'},
  @{Id='module-4'; Title='Christs Sabbath and Worship Practice'; Minutes=50; Scriptures='Luke 4:16; Mark 2:27-28; Isaiah 58:13-14'; EGW='Desire of Ages worship/Sabbath excerpts placeholder'; Hist='Historical records present communal worship as central in Christian life, with Christs teaching reframing worship as mercy, truth, and delight in God rather than mere formality.'},
  @{Id='module-5'; Title='Christs Compassion and Service'; Minutes=40; Scriptures='Matthew 9:36; Mark 10:45; John 13:1-17'; EGW='Ministry of Healing service excerpts placeholder'; Hist='Public-domain Christian sources repeatedly present almsgiving, healing ministry, and hospitality as expected expressions of discipleship rooted in Christs own service.'},
  @{Id='module-6'; Title='Christs Teaching on Love and Law'; Minutes=45; Scriptures='Matthew 22:37-40; John 14:15; Romans 13:10'; EGW='Faith and Works / Christ-centered obedience excerpts placeholder'; Hist='Across early Christian teaching traditions, love of God and neighbor was presented as the moral center of obedience. Law and grace were taught as complementary in Christ.'},
  @{Id='module-7'; Title='Christs Habits of Solitude and Retreat'; Minutes=35; Scriptures='Mark 6:31; Luke 5:16; Psalm 46:10'; EGW='Desire of Ages solitude excerpts placeholder'; Hist='Historical devotional records include practices of retreat, silence, and meditative prayer as means of renewal for service and resistance to spiritual exhaustion.'},
  @{Id='module-8'; Title='Christs Model of Discipleship and Mentoring'; Minutes=50; Scriptures='Matthew 28:19-20; Luke 9:1-6; 2 Timothy 2:2'; EGW='Gospel Workers discipleship excerpts placeholder'; Hist='Discipleship in early Christian communities followed relational apprenticeship: teaching, correction, mission practice, and multiplication under spiritual oversight.'},
  @{Id='module-9'; Title='Christs Response to Suffering and Injustice'; Minutes=45; Scriptures='Luke 23:34; 1 Peter 2:23; Hebrews 12:2-3'; EGW='Desire of Ages cross-centered endurance excerpts placeholder'; Hist='Public-domain testimony collections show Christians interpreting suffering through Christs cross: neither denial of pain nor vengeance, but faithful endurance with hope.'},
  @{Id='module-10'; Title='Living Christs Christianity Today'; Minutes=60; Scriptures='Galatians 2:20; John 15:5; Colossians 3:12-17'; EGW='Acts of the Apostles church-life excerpts placeholder'; Hist='Modern and historical records alike describe durable discipleship as ordinary faithfulness: prayer, Scripture, service, fellowship, mission, and dependence on grace.'}
)

foreach ($m in $modules) {
  $dir = Join-Path "content/modules" $m.Id
  New-Item -ItemType Directory -Path $dir -Force | Out-Null

  $parts = $m.Scriptures.Split(';')

  $core = @"
---
id: "$($m.Id)-lesson-1"
title: "$($m.Title)"
moduleId: "$($m.Id)"
objectives:
  - "See Christ as model and source of Christian life"
  - "Apply Spirit-led discipleship habits in daily practice"
  - "Grow in assurance rooted in grace through faith"
estimatedMinutes: $($m.Minutes)
scripturePassages:
  - "$($parts[0].Trim())"
  - "$($parts[1].Trim())"
  - "$($parts[2].Trim())"
egwExcerpts:
  - title: "$($m.EGW)"
    url: "EGW_PUBLIC_DOMAIN_PLACEHOLDER"
historicalNotes: "$($m.Hist)"
---

# $($m.Title)

## Bible Foundation

**Scripture**  
> $($m.Scriptures)

Christ reveals authentic Christianity by living in continual union with the Father. This lesson frames discipleship as a grace-born life that receives, reflects, and reproduces the character of Christ.

## Spirit of Prophecy

> [EGW public-domain excerpt placeholder with citation and link]

Ellen G. White consistently points believers to Christ as both substitute and example: salvation is received through Him, and transformation is formed by abiding in Him.

## Historical Context

$($m.Hist)

## Practical Application

A Christ-centered disciple follows a rhythm of prayer, Scripture, service, and accountability. These habits do not earn salvation; they train attention toward Christ and make room for Spirit-led growth in love, truth, and mission.

## Accountability

Create a weekly review with one trusted believer. Track prayer, Scripture, service, and solitude as signs of abiding, and respond to failure with repentance, not despair.

## Reflection Prompts
- Where is Christ inviting me to deeper trust this week?
- Which habit has become mechanical instead of relational?
- What fear prevents full obedience right now?
- How can I serve one person quietly in Christ’s name?
- What step of reconciliation is the Spirit prompting today?

## Practical Exercises
- Keep a 7-day prayer and Scripture journal.
- Practice one anonymous act of service.
- Schedule one period of silence and retreat this week.
- Memorize one passage from this lesson and pray it daily.
- Share one testimony of Christ’s work with a friend.

## Daily Habit Suggestions
- 15 minutes of prayer and intercession
- 1 gospel passage meditation
- 1 intentional service action
- Evening examen: gratitude, confession, next step

## Quiz (7 Questions)
1. **MCQ:** What best defines salvation in this course?  
   A) Human effort B) Grace through faith in Christ C) Ritual precision D) Moral comparison  
   **Answer:** B. *Ephesians 2:8-10; EGW grace-centered discipleship emphasis.*
2. **MCQ:** Why are spiritual habits practiced?  
   A) To earn acceptance B) To avoid community C) To abide in Christ D) To replace prayer  
   **Answer:** C. *John 15:5; EGW: communion with Christ as the source of power.*
3. **MCQ:** Which trait marks Christlike discipleship most clearly?  
   A) Pride B) Performance anxiety C) Love expressed in obedience D) Isolation from mission  
   **Answer:** C. *John 13:34-35; John 14:15.*
4. **Scenario:** You failed repeatedly this week. Best response?  
   **Answer:** Return to Christ in repentance, receive grace, and continue with accountability. *1 John 1:9; Hebrews 4:16.*
5. **Scenario:** A church member is discouraged. Best response?  
   **Answer:** Encourage with Scripture, pray together, and offer practical care. *Galatians 6:1-2; EGW pastoral counsel.*
6. **True/False:** Obedience is fruit of Spirit-led transformation, not the price of salvation.  
   **Answer:** True.
7. **Short Answer:** What concrete step will you take this week to follow Christ more intentionally?

## Theological Guardrail

**Salvation by grace through faith** is fully affirmed (Romans 3:24; Ephesians 2:8-10). **Justification** is Christ’s gift, received by faith. **Sanctification** is Spirit-led growth in Christlikeness (Galatians 5:22-25). The Christianity of Christ is relational, hopeful, and non-legalistic.

## Resources
- **Bible:** BIBLE_PUBLIC_DOMAIN_PLACEHOLDER
- **Ellen G. White:** EGW_PUBLIC_DOMAIN_PLACEHOLDER
- **Historical Record:** HISTORY_PUBLIC_DOMAIN_PLACEHOLDER
- **Audio Lesson:** AUDIO_PLACEHOLDER
"@

  $deep1 = @"
---
id: "$($m.Id)-deep-dive-1"
title: "Deep Dive 1: Foundations for $($m.Title)"
moduleId: "$($m.Id)"
objectives:
  - "Explore doctrinal foundations in a pastoral way"
estimatedMinutes: 20
scripturePassages:
  - "$($parts[0].Trim())"
  - "$($parts[1].Trim())"
  - "$($parts[2].Trim())"
egwExcerpts:
  - title: "$($m.EGW)"
    url: "EGW_PUBLIC_DOMAIN_PLACEHOLDER"
historicalNotes: "$($m.Hist)"
---

# Deep Dive 1: Foundations for $($m.Title)

This optional lesson expands biblical theology, adds pastoral examples, and offers extended study pathways.

## Theological Guardrail

Grace-first discipleship remains central. Growth is by union with Christ through the Holy Spirit.
"@

  $deep2 = @"
---
id: "$($m.Id)-deep-dive-2"
title: "Deep Dive 2: Practicing $($m.Title)"
moduleId: "$($m.Id)"
objectives:
  - "Translate theology into concrete daily action"
estimatedMinutes: 20
scripturePassages:
  - "$($parts[0].Trim())"
  - "$($parts[1].Trim())"
  - "$($parts[2].Trim())"
egwExcerpts:
  - title: "$($m.EGW)"
    url: "EGW_PUBLIC_DOMAIN_PLACEHOLDER"
historicalNotes: "$($m.Hist)"
---

# Deep Dive 2: Practicing $($m.Title)

This optional lesson gives practical routines, accountability checklists, and case studies for modern discipleship.

## Theological Guardrail

Obedience flows from grace. Christ remains the source, pattern, and goal of discipleship.
"@

  Set-Content -Path (Join-Path $dir "lesson-1.mdx") -Value $core -Encoding UTF8
  Set-Content -Path (Join-Path $dir "deep-dive-1.mdx") -Value $deep1 -Encoding UTF8
  Set-Content -Path (Join-Path $dir "deep-dive-2.mdx") -Value $deep2 -Encoding UTF8
}
