import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    Award,
    CheckCircle,
    Edit2,
    Save,
    X,
    Clock,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
    
    "2 Corinthians 6:14": {
        KJV: "14 Be ye not unequally yoked together with unbelievers: for what fellowship hath righteousness with unrighteousness? and what communion hath light with darkness?",
        NKJV: "14 Do not be unequally yoked together with unbelievers. For what fellowship has righteousness with lawlessness? And what communion has light with darkness?",
        NIV: "14 Do not be yoked together with unbelievers. For what do righteousness and wickedness have in common? Or what fellowship can light have with darkness?",
        ESV: "14 Do not be unequally yoked with unbelievers. For what partnership has righteousness with lawlessness? Or what fellowship has light with darkness?",
        AMP: "14 Do not be unequally yoked with unbelievers [do not make misaligned alliances with them or come under a different spirit, which is inconsistent with your faith]. For what partnership have righteousness and lawlessness [or how can right conduct and lawlessness be partners]? Or what fellowship has light with darkness?",
        NLT: "14 Don’t team up with those who are unbelievers. How can righteousness be a partner with wickedness? How can light live with darkness?"
    },
    "Ephesians 5:15": {
        KJV: "15 See then that ye walk circumspectly, not as fools, but as wise,",
        NKJV: "15 See then that you walk circumspectly, not as fools but as wise,",
        NIV: "15 Be very careful, then, how you live—not as unwise but as wise,",
        ESV: "15 Look carefully then how you walk, not as unwise but as wise,",
        AMP: "15 Therefore see that you walk carefully [living life with honor, purpose, and gratitude; not as men who are unwise, but as wise sensible minds],",
        NLT: "15 So be careful how you live. Don’t live like fools, but like those who are wise."
    },
    "Joshua 9:14": {
        KJV: "14 And the men took of their victuals, and asked not counsel at the mouth of the Lord.",
        NKJV: "14 Then the men of Israel took some of their provisions; but they did not ask counsel of the Lord.",
        NIV: "14 The Israelites sampled their provisions but did not inquire of the Lord.",
        ESV: "14 So the men took some of their provisions, but did not ask counsel from the Lord.",
        AMP: "14 So the men [of Israel] took some of their own provisions [and offered them in friendship], and did not ask for the counsel of the Lord.",
        NLT: "14 So the Israelites examined their food, but they did not consult the Lord."
    },
    "Joshua 9:14-19": {
        KJV: "14 And the men took of their victuals, and asked not counsel at the mouth of the Lord. 15 And Joshua made peace with them, and made a league with them, to let them live: and the princes of the congregation sware unto them. 16 And it came to pass at the end of three days after they had made a league with them, that they heard that they were their neighbours, and that they dwelt among them. 17 And the children of Israel journeyed, and came unto their cities on the third day. Now their cities were Gibeon, and Chephirah, and Beeroth, and Kirjathjearim. 18 And the children of Israel smote them not, because the princes of the congregation had sworn unto them by the Lord God of Israel. And all the congregation murmured against the princes. 19 But all the princes said unto all the congregation, We have sworn unto them by the Lord God of Israel: now therefore we may not touch them.",
        NKJV: "14 Then the men of Israel took some of their provisions; but they did not ask counsel of the Lord. 15 So Joshua made peace with them, and made a covenant with them to let them live; and the rulers of the congregation swore to them. 16 And it happened at the end of three days, after they had made a covenant with them, that they heard that they were their neighbors who dwelt near them. 17 Then the children of Israel journeyed and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kirjath Jearim. 18 But the children of Israel did not attack them, because the rulers of the congregation had sworn to them by the Lord God of Israel. And all the congregation complained against the rulers. 19 Then all the rulers said to all the congregation, 'We have sworn to them by the Lord God of Israel; now therefore, we may not touch them.'",
        NIV: "14 The Israelites sampled their provisions but did not inquire of the Lord. 15 Then Joshua made a treaty of peace with them to let them live, and the leaders of the assembly ratified it by oath. 16 Three days after they made the treaty with the Gibeonites, the Israelites heard that they were neighbors, living near them. 17 So the Israelites set out and on the third day came to their cities: Gibeon, Kephirah, Beeroth and Kiriath Jearim. 18 But the Israelites did not attack them, because the leaders of the assembly had sworn an oath to them by the Lord, the God of Israel. The whole assembly grumbled against the leaders. 19 But all the leaders answered, 'We have given them our oath by the Lord, the God of Israel, and we cannot touch them now.'",
        ESV: "14 So the men took some of their provisions, but did not ask counsel from the Lord. 15 And Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore to them. 16 But at the end of three days after they had made a covenant with them, they heard that they were their neighbors and that they lived among them. 17 And the people of Israel set out and reached their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 But the people of Israel did not attack them, because the leaders of the congregation had sworn to them by the Lord, the God of Israel. Then all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn to them by the Lord, the God of Israel, and now we may not touch them.'",
        AMP: "14 So the men [of Israel] took some of their own provisions [and offered them in friendship], and did not ask for the counsel of the Lord. 15 Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore an oath to them. 16 It happened that after they had made a covenant with them, they heard that they were actually their neighbors and lived among them. 17 Then the sons of Israel set out and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 The sons of Israel did not kill them because the leaders of the congregation had sworn an oath to them by the Lord, the God of Israel. And all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn an oath to them by the Lord, the God of Israel, and now we cannot touch them.'",
        NLT: "14 So the Israelites examined their food, but they did not consult the Lord. 15 Then Joshua made a peace treaty with them and guaranteed their safety, and the leaders of the community ratified their agreement with a binding oath. 16 Three days after making the treaty, they learned that these people actually lived nearby! 17 The Israelites set out at once to investigate and reached their towns in three days. The towns were Gibeon, Kephirah, Beeroth, and Kiriath-jearim. 18 But the Israelites did not attack the towns, for the Israelite leaders had made a vow to them in the name of the Lord, the God of Israel. The people of Israel grumbled against the leaders because of the treaty. 19 But the leaders replied, 'Since we have sworn an oath in the presence of the Lord, the God of Israel, we cannot touch them.'"
    },
    "2 Samuel 21:1-9": {
        KJV: "1 Then there was a famine in the days of David three years, year after year; and David enquired of the Lord. And the Lord answered, It is for Saul, and for his bloody house, because he slew the Gibeonites. 2 And the king called the Gibeonites, and said unto them; (now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; and the children of Israel had sworn unto them: and Saul sought to slay them in his zeal to the children of Israel and Judah.) 3 Wherefore David said unto the Gibeonites, What shall I do for you? and wherewith shall I make the atonement, that ye may bless the inheritance of the Lord? 4 And the Gibeonites said unto him, We will have no silver nor gold of Saul, nor of his house; neither for us shalt thou kill any man in Israel. And he said, What ye shall say, that will I do for you. 5 And they answered the king, The man that consumed us, and that devised against us that we should be destroyed from remaining in any of the coasts of Israel, 6 Let seven men of his sons be delivered unto us, and we will hang them up unto the Lord in Gibeah of Saul, whom the Lord did choose. And the king said, I will give them. 7 But the king spared Mephibosheth, the son of Jonathan the son of Saul, because of the Lord's oath that was between them, between David and Jonathan the son of Saul. 8 But the king took the two sons of Rizpah the daughter of Aiah, whom she bare unto Saul, Armoni and Mephibosheth; and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite: 9 And he delivered them into the hands of the Gibeonites, and they hanged them in the hill before the Lord: and they fell all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
        NKJV: "1 Now there was a famine in the days of David for three years, year after year; and David inquired of the Lord. And the Lord answered, 'It is because of Saul and his bloodthirsty house, because he killed the Gibeonites.' 2 So the king called the Gibeonites and spoke to them. (Now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; the children of Israel had sworn protection to them, but Saul had sought to kill them in his zeal for the children of Israel and Judah.) 3 Therefore David said to the Gibeonites, 'What shall I do for you? And with what shall I make atonement, that you may bless the inheritance of the Lord?' 4 And the Gibeonites said to him, 'We will have no silver or gold from Saul or from his house, nor shall you kill any man in Israel for us.' So he said, 'Whatever you say, I will do for you.' 5 Then they answered the king, 'As for the man who consumed us and plotted against us, that we should be destroyed from remaining in any of the territories of Israel, 6 let seven men of his descendants be delivered to us, and we will hang them before the Lord in Gibeah of Saul, whom the Lord chose.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the Lord’s oath that was between them, between David and Jonathan the son of Saul. 8 So the king took Armoni and Mephibosheth, the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite; 9 and he delivered them into the hands of the Gibeonites, and they hanged them on the hill before the Lord. So they fell, all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
        NIV: "1 During the reign of David, there was a famine for three successive years; so David sought the face of the Lord. The Lord said, 'It is on account of Saul and his blood-stained house; it is because he put the Gibeonites to death.' 2 The king summoned the Gibeonites and spoke to them. (Now the Gibeonites were not Israelites, but a remnant of the Amorites; the Israelites had sworn to spare them, but Saul in his zeal for Israel and Judah had tried to annihilate them.) 3 David asked the Gibeonites, 'What shall I do for you? How shall I make atonement so that you will bless the Lord’s inheritance?' 4 The Gibeonites answered him, 'We have no right to demand silver or gold from Saul or his family, nor do we have the right to put anyone in Israel to death.' 'What do you want me to do for you?' David asked. 5 They answered the king, 'As for the man who destroyed us and plotted against us so that we have been decimated and have no place anywhere in Israel, 6 let seven of his male descendants be given to us to be killed and exposed before the Lord at Gibeah of Saul—the Lord’s chosen one.' So the king said, 'I will give them.' 7 The king spared Mephibosheth son of Jonathan, the son of Saul, because of the oath before the Lord between David and Jonathan son of Saul. 8 But the king took Armoni and Mephibosheth, the two sons of Rizpah daughter of Aiah, whom she had borne to Saul, together with the five sons of Saul’s daughter Merab, whom she had borne to Adriel son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, who killed them and exposed them on a hill before the Lord. All seven of them fell together; they were put to death during the first days of the harvest, just as the barley harvest was beginning.",
        ESV: "1 Now there was a famine in the days of David for three years, year after year. And David sought the face of the Lord. And the Lord said, 'There is bloodguilt on Saul and on his house, because he put the Gibeonites to death.' 2 So the king called the Gibeonites and spoke to them. Now the Gibeonites were not of the people of Israel but of the remnant of the Amorites. Although the people of Israel had sworn to spare them, Saul had sought to strike them down in his zeal for the people of Israel and Judah. 3 And David said to the Gibeonites, 'What shall I do for you? And how shall I make atonement, that you may bless the heritage of the Lord?' 4 The Gibeonites said to him, 'It is not a matter of silver or gold between us and Saul or his house; neither is it for us to put any man to death in Israel.' And he said, 'What do you say that I shall do for you?' 5 They said to the king, 'The man who consumed us and planned to destroy us, so that we should have no place in all the territory of Israel, 6 let seven of his sons be given to us, so that we may hang them before the Lord at Gibeah of Saul, whom the Lord chose.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, Saul's son, because of the oath of the Lord that was between them, between David and Jonathan the son of Saul. 8 The king took the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, Armoni and Mephibosheth; and the five sons of Merab the daughter of Saul, whom she bore to Adriel the son of Barzillai the Meholathite; 9 and he gave them into the hands of the Gibeonites, and they hanged them on the mountain before the Lord, and the seven of them perished together. They were put to death in the first days of harvest, at the beginning of barley harvest.",
        AMP: "1 Now there was a famine in the days of David for three years, year after year; and David sought the face of the Lord [and asked the reason for it]. The Lord answered, 'It is because of Saul and his bloody house, because he put the Gibeonites to death.' 2 So the king called the Gibeonites and spoke to them (now the Gibeonites were not of the sons of Israel but of the remnant of the Amorites, and the sons of Israel had sworn [an oath] to spare them, but Saul in his zeal for the sons of Israel and Judah had sought to strike them down). 3 So David said to the Gibeonites, 'What shall I do for you? And with what shall I make atonement so that you will bless the inheritance of the Lord?' 4 The Gibeonites said to him, 'It is not a matter of silver or gold between us and Saul or his house, nor is it for us to put any man to death in Israel.' David said, 'I will do for you whatever you say.' 5 So they said to the king, 'The man who consumed us and planned to destroy us, so that we should have no place in all the territory of Israel, 6 let seven men from his sons be given to us and we will hang them before the Lord in Gibeah of Saul, the chosen one of the Lord.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the Lord’s oath that was between them, between David and Jonathan the son of Saul. 8 So the king took the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, Armoni and Mephibosheth, and the five sons of Merab the daughter of Saul, whom she bore to Adriel the son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, and they hanged them on the mountain before the Lord; the seven of them died together. They were put to death in the first days of harvest, at the beginning of the barley harvest.",
        NLT: "1 There was a famine during David’s reign that lasted for three years, so David asked the Lord about it. And the Lord said, 'The famine has come because Saul and his family are guilty of murdering the Gibeonites.' 2 So the king summoned the Gibeonites. They were not part of the Israelite nation but were survivors of the Amorites; the Israelites had promised to spare them, but Saul, in his zeal for Israel and Judah, had tried to destroy them. 3 David asked them, 'What can I do for you? How can I make amends so that you will again pronounce a blessing on the Lord’s inheritance?' 4 'Well, money can’t settle this matter between us and the family of Saul,' the Gibeonites replied. 'Neither can we demand the life of anyone in Israel.' 'What can I do then?' David asked. 'Just tell me and I will do it for you.' 5 Then they replied, 'It was Saul who planned to destroy us, to keep us from having any place at all in the territory of Israel. 6 So let seven of his sons be handed over to us, and we will execute them before the Lord at Gibeah, the hometown of Saul, the Lord’s chosen king.' 'All right,' the king said, 'I will do it.' 7 The king spared Jonathan’s son Mephibosheth, who was Saul’s grandson, because of the oath David and Jonathan had sworn before the Lord. 8 But he gave them Armoni and Mephibosheth, the two sons of Saul and Rizpah daughter of Aiah. He also gave them the five sons of Saul’s daughter Merab, the wife of Adriel son of Barzillai from Meholah. 9 The king gave them to the Gibeonites, who executed them on the mountain before the Lord. So all seven of them died together at the beginning of the barley harvest."
    },
    "Exodus 23:32-34": {
        KJV: "32 Thou shalt make no covenant with them, nor with their gods. 33 They shall not dwell in thy land, lest they make thee sin against me: for if thou serve their gods, it will surely be a snare unto thee.",
        NKJV: "32 You shall make no covenant with them, nor with their gods. 33 They shall not dwell in your land, lest they make you sin against Me. For if you serve their gods, it will surely be a snare to you.",
        NIV: "32 Do not make a covenant with them or with their gods. 33 Do not let them live in your land or they will cause you to sin against me, because the worship of their gods will certainly be a snare to you.",
        ESV: "32 You shall make no covenant with them and their gods. 33 They shall not dwell in your land, lest they make you sin against me; for if you serve their gods, it will surely be a snare to you.",
        AMP: "32 You shall make no covenant with them nor with their gods. 33 They shall not live in your land, because they will make you sin against Me; for if you serve their gods, it will surely be a snare to you [leading to eternal death].",
        NLT: "32 Make no treaty with them or their gods. 33 They must not live in your land, or they will cause you to sin against me. If you serve their gods, you will be caught in the trap of idolatry."
    },
    "Exodus 23:32": {
        KJV: "32 Thou shalt make no covenant with them, nor with their gods.",
        NKJV: "32 You shall make no covenant with them, nor with their gods.",
        NIV: "32 Do not make a covenant with them or with their gods.",
        ESV: "32 You shall make no covenant with them and their gods.",
        AMP: "32 You shall make no covenant with them nor with their gods.",
        NLT: "32 Make no treaty with them or their gods."
    },
    "Exodus 34:12-17": {
        KJV: "12 Take heed to thyself, lest thou make a covenant with the inhabitants of the land whither thou goest, lest it be for a snare in the midst of thee: 13 But ye shall destroy their altars, break their images, and cut down their groves: 14 For thou shalt worship no other god: for the Lord, whose name is Jealous, is a jealous God: 15 Lest thou make a covenant with the inhabitants of the land, and they go a whoring after their gods, and do sacrifice unto their gods, and one call thee, and thou eat of his sacrifice; 16 And thou take of their daughters unto thy sons, and their daughters go a whoring after their gods, and make thy sons go a whoring after their gods. 17 Thou shalt make thee no molten gods.",
        NKJV: "12 Take heed to yourself, lest you make a covenant with the inhabitants of the land where you are going, lest it be a snare in your midst. 13 But you shall destroy their altars, break their sacred pillars, and cut down their wooden images 14 (for you shall worship no other god, for the Lord, whose name is Jealous, is a jealous God), 15 lest you make a covenant with the inhabitants of the land, and they play the harlot with their gods and make sacrifice to their gods, and one of them invites you and you eat of his sacrifice, 16 and you take of their daughters for your sons, and their daughters play the harlot with their gods and make your sons play the harlot with their gods. 17 You shall make no molded gods for yourselves.",
        NIV: "12 Be careful not to make a treaty with those who live in the land where you are going, or they will be a snare among you. 13 Break down their altars, smash their sacred stones and cut down their Asherah poles. 14 Do not worship any other god, for the Lord, whose name is Jealous, is a jealous God. 15 Be careful not to make a treaty with those who live in the land; for when they prostitute themselves to their gods and sacrifice to them, they will invite you and you will eat their sacrifices. 16 And when you choose some of their daughters as wives for your sons and those daughters prostitute themselves to their gods, they will lead your sons to do the same. 17 Do not make any idols.",
        ESV: "12 Take care, lest you make a covenant with the inhabitants of the land to which you go, lest it become a snare in your midst. 13 You shall tear down their altars and break their pillars and cut down their Asherim 14 (for you shall worship no other god, for the Lord, whose name is Jealous, is a jealous God), 15 lest you make a covenant with the inhabitants of the land, and when they whore after their gods and sacrifice to their gods and you are invited, you eat of his sacrifice, 16 and you take of their daughters for your sons, and their daughters whore after their gods and make your sons whore after their gods. 17 You shall not make for yourself any gods of cast metal.",
        AMP: "12 Watch yourself, lest you make a covenant with the inhabitants of the land into which you are going, lest it become a snare in your midst. 13 But you shall tear down their altars, smash their [pagan] pillars, and cut down their Asherim (symbols of the goddess Asherah) 14 —for you shall not worship any other god; for the Lord, whose name is Jealous, is a jealous (impassioned) God [demanding what is His and its rightful due]— 15 lest you make a covenant with the inhabitants of the land and they play the prostitute with their gods and sacrifice to their gods, and someone invites you to eat his sacrifice, 16 and you take some of their daughters for your sons, and their daughters play the prostitute with their gods and make your sons play the prostitute with their gods. 17 You shall not make for yourselves any gods of cast metal.",
        NLT: "12 Be very careful never to make a treaty with the people who live in the land where you are going. If you do, you will follow their evil ways and be trapped. 13 Instead, you must break down their pagan altars, smash their sacred pillars, and cut down their Asherah poles. 14 You must worship no other gods, for the Lord, whose very name is Jealous, is a God who is jealous about his relationship with you. 15 Do not make a treaty of any kind with the people living in the land. They lust after their gods by offering sacrifices to them. They will invite you to join them in their sacrificial meals, and you will go with them. 16 Then you will accept their daughters, who sacrifice to other gods, as wives for your sons. And they will seduce your sons to commit adultery against me by worshiping other gods. 17 You must never make any gods of cast metal."
    },
    "Deuteronomy 7:2-3": {
        KJV: "2 And when the Lord thy God shall deliver them before thee; thou shalt smite them, and utterly destroy them; thou shalt make no covenant with them, nor shew mercy unto them: 3 Neither shalt thou make marriages with them; thy daughter thou shalt not give unto his son, nor his daughter shalt thou take unto thy son.",
        NKJV: "2 and when the Lord your God delivers them over to you, you shall conquer them and utterly destroy them. You shall make no covenant with them nor show mercy to them. 3 Nor shall you make marriages with them. You shall not give your daughter to their son, nor take their daughter for your son.",
        NIV: "2 and when the Lord your God has delivered them over to you and you have defeated them, then you must destroy them totally. Make no treaty with them, and show them no mercy. 3 Do not intermarry with them. Do not give your daughters to their sons or take their daughters for your sons,",
        ESV: "2 and when the Lord your God gives them over to you, and you defeat them, then you must devote them to complete destruction. You shall make no covenant with them and show no mercy to them. 3 You shall not intermarry with them, giving your daughters to their sons or taking their daughters for your sons,",
        AMP: "2 and when the Lord your God hands them over to you and you defeat them, then you must utterly destroy them. You shall not make a covenant with them nor show mercy to them. 3 You shall not intermarry with them; you shall not give your daughter to his son, nor shall you take his daughter for your son.",
        NLT: "2 When the Lord your God hands them over to you and you conquer them, you must completely destroy them. Make no treaty with them and show them no mercy. 3 You must not intermarry with them. Do not let your daughters marry their sons! And do not let your sons marry their daughters,"
    },
    
    "Joshua 10:6-7": {
        KJV: "6 And the men of Gibeon sent unto Joshua to the camp to Gilgal, saying, Slack not thy hand from thy servants; come up to us quickly, and save us, and help us: for all the kings of the Amorites that dwell in the mountains are gathered together against us. 7 So Joshua ascended from Gilgal, he, and all the people of war with him, and all the mighty men of valour.",
        NKJV: "6 And the men of Gibeon sent to Joshua at the camp at Gilgal, saying, 'Do not forsake your servants; come up to us quickly, save us and help us, for all the kings of the Amorites who dwell in the mountains have gathered together against us.' 7 So Joshua ascended from Gilgal, he and all the people of war with him, and all the mighty men of valor.",
        NIV: "6 The Gibeonites then sent word to Joshua in the camp at Gilgal: 'Do not abandon your servants. Come up to us quickly and save us! Help us, because all the Amorite kings from the hill country have joined forces against us.' 7 So Joshua marched up from Gilgal with his entire army, including all the best fighting men.",
        ESV: "6 And the men of Gibeon sent to Joshua at the camp in Gilgal, saying, 'Do not relax your hand from your servants. Come up to us quickly and save us and help us, for all the kings of the Amorites who dwell in the hill country are gathered against us.' 7 So Joshua went up from Gilgal, he and all the people of war with him, and all the mighty men of valor.",
        AMP: "6 So the men of Gibeon sent word to Joshua at the camp in Gilgal, saying, 'Do not abandon your servants; come up to us quickly and save us and help us, for all the [five] kings of the Amorites who live in the hill country have assembled against us.' 7 So Joshua went up from Gilgal, he and all the people of war with him and all the brave men of valor.",
        NLT: "6 The men of Gibeon quickly sent messengers to Joshua at his camp in Gilgal. 'Don’t abandon your servants now!' they pleaded. 'Come at once! Save us! Help us! For all the Amorite kings who live in the hill country have joined forces against us.' 7 So Joshua and his entire army, including his finest warriors, left Gilgal and set out for Gibeon."
    },
  
  "Joshua 9:18": {
    "KJV": "18 And the children of Israel smote them not, because the princes of the congregation had sworn unto them by the Lord God of Israel. And all the congregation murmured against the princes.",
    "NKJV": "18 But the children of Israel did not attack them, because the rulers of the congregation had sworn to them by the Lord God of Israel. And all the congregation complained against the rulers.",
    "NIV": "18 But the Israelites did not attack them, because the leaders of the assembly had sworn an oath to them by the Lord, the God of Israel. The whole assembly grumbled against the leaders,",
    "ESV": "18 But the people of Israel did not attack them, because the leaders of the congregation had sworn to them by the Lord, the God of Israel. Then all the congregation murmured against the leaders.",
    "AMP": "18 The sons of Israel did not strike them down because the leaders of the congregation had sworn to them by the Lord the God of Israel. And all the congregation murmured against the leaders.",
    "NLT": "18 But the Israelites did not attack the towns, for the leaders had made a vow to them in the name of the Lord, the God of Israel. The people of Israel grumbled against their leaders because of the treaty."
  },
  "Joshua 9:18-19": {
    "KJV": "18 And the children of Israel smote them not, because the princes of the congregation had sworn unto them by the Lord God of Israel. And all the congregation murmured against the princes. 19 But all the princes said unto all the congregation, We have sworn unto them by the Lord God of Israel: now therefore we may not touch them.",
    "NKJV": "18 But the children of Israel did not attack them, because the rulers of the congregation had sworn to them by the Lord God of Israel. And all the congregation complained against the rulers. 19 Then all the rulers said to all the congregation, 'We have sworn to them by the Lord God of Israel; now therefore we may not touch them.'",
    "NIV": "18 But the Israelites did not attack them, because the leaders of the assembly had sworn an oath to them by the Lord, the God of Israel. The whole assembly grumbled against the leaders, 19 but all the leaders answered, 'We have given them our oath by the Lord, the God of Israel, and we cannot touch them now.'",
    "ESV": "18 But the people of Israel did not attack them, because the leaders of the congregation had sworn to them by the Lord, the God of Israel. Then all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn to them by the Lord, the God of Israel, and now we may not touch them.'",
    "AMP": "18 The sons of Israel did not strike them down because the leaders of the congregation had sworn to them by the Lord the God of Israel. And all the congregation murmured against the leaders. 19 But all the leaders said to the entire congregation, 'We have sworn to them by the Lord, the God of Israel, and now we cannot touch them.'",
    "NLT": "18 But the Israelites did not attack the towns, for the leaders had made a vow to them in the name of the Lord, the God of Israel. The people of Israel grumbled against their leaders because of the treaty. 19 But the leaders replied, 'Since we have sworn an oath in the presence of the Lord, the God of Israel, we cannot touch them.'"
  },
  
  "Exodus 24:7": {
    "KJV": "7 And he took the book of the covenant, and read in the audience of the people: and they said, All that the Lord hath said will we do, and be obedient.",
    "NKJV": "7 Then he took the Book of the Covenant and read in the hearing of the people. And they said, 'All that the Lord has said we will do, and be obedient.'",
    "NIV": "7 Then he took the Book of the Covenant and read it to the people. They responded, 'We will do everything the Lord has said; we will obey.'",
    "ESV": "7 Then he took the Book of the Covenant and read it in the hearing of the people. And they said, 'All that the Lord has spoken we will do, and we will be obedient.'",
    "AMP": "7 Then he took the Book of the Covenant and read it aloud to the people; and they said, 'All that the Lord has spoken we will do, and we will be obedient.'",
    "NLT": "7 Then he took the Book of the Covenant and read it aloud to the people. Again they all responded, 'We will do everything the Lord has commanded. We will obey.'"
  },
  "Leviticus 26:45": {
    "KJV": "45 But I will for their sakes remember the covenant of their ancestors, whom I brought forth out of the land of Egypt in the sight of the heathen, that I might be their God: I am the Lord.",
    "NKJV": "45 But for their sake I will remember the covenant of their ancestors, whom I brought out of the land of Egypt in the sight of the nations, that I might be their God: I am the Lord.",
    "NIV": "45 But for their sake I will remember the covenant with their ancestors whom I brought out of Egypt in the sight of the nations to be their God. I am the Lord.'",
    "ESV": "45 But I will for their sake remember the covenant with their forefathers, whom I brought out of the land of Egypt in the sight of the nations, that I might be their God: I am the Lord.'",
    "AMP": "45 But for their sake I will [earnestly] remember the covenant with their ancestors, whom I brought out of the land of Egypt in the sight of the nations, that I might be their God. I am the Lord.'",
    "NLT": "45 For their sakes I will remember my ancient covenant with their ancestors, whom I brought out of the land of Egypt in the sight of all the nations, that I might be their God. I am the Lord.'"
  },
  "Psalm 111:5": {
    "KJV": "5 He hath given meat unto them that fear him: he will ever be mindful of his covenant.",
    "NKJV": "5 He has given food to those who fear Him; He will ever be mindful of His covenant.",
    "NIV": "5 He provides food for those who fear him; he remembers his covenant forever.",
    "ESV": "5 He provides food for those who fear him; he remembers his covenant forever.",
    "AMP": "5 He has given food to those who fear Him [with awe-inspired reverence]; He will remember His covenant forever.",
    "NLT": "5 He gives food to those who fear him; he always remembers his covenant."
  },
  "Haggai 2:5": {
    "KJV": "5 According to the word that I covenanted with you when ye came out of Egypt, so my spirit remaineth among you: fear ye not.",
    "NKJV": "5 'According to the word that I covenanted with you when you came out of Egypt, so My Spirit remains among you; do not fear!'",
    "NIV": "5 'This is what I covenanted with you when you came out of Egypt. And my Spirit remains among you. Do not fear.'",
    "ESV": "5 according to the covenant that I made with you when you came out of Egypt. My Spirit remains in your midst. Fear not.",
    "AMP": "5 'As for the promise which I made with you when you came out of Egypt, My Spirit stands [unsettled and prevailing] in your midst; do not fear.'",
    "NLT": "5 'My Spirit remains among you, just as I promised when you came out of Egypt. So do not be afraid.'"
  },
  "Matthew 11:28": {
    "KJV": "28 Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    "NKJV": "28 Come to Me, all you who labor and are heavy laden, and I will give you rest.",
    "NIV": "28 'Come to me, all you who are weary and burdened, and I will give you rest.'",
    "ESV": "28 Come to me, all who labor and are heavy laden, and I will give you rest.",
    "AMP": "28 'Come to Me, all who are weary and heavily burdened [by religious rituals that provide no peace], and I will give you rest [refreshing your souls with salvation].'",
    "NLT": "28 Then Jesus said, 'Come to me, all of you who are weary and carry heavy burdens, and I will give you rest.'"
  }
};

const quizQuestions = [
    {
        q: "Immediately after a covenant is agreed upon, what is the deeper implication of it being recorded in the divine registry?",
        a: [
            "It establishes an unalterable spiritual precedent that influences destiny",
            "It only has legal force if human witnesses remember it",
            "It can be disregarded if circumstances change",
            "It serves merely as a symbolic gesture without real effect"
        ],
        correct: 0
    },
    {
        q: "Why does a covenant retain its potency even if one party forgets or neglects it?",
        a: [
            "Because God, as the divine witness, guarantees its continued validity",
            "Because repeated human action reinforces the covenant",
            "Because time naturally enforces all agreements",
            "Because human law codifies all covenants permanently"
        ],
        correct: 0
    },
    {
        q: "What is the theological reason a covenant is considered close to God’s heart?",
        a: [
            "It reflects His character, credibility, and the integrity of His name",
            "It primarily benefits humans and ensures their obedience",
            "It replaces acts of worship and obedience in importance",
            "It cannot be questioned or challenged by humans under any circumstance"
        ],
        correct: 0
    },
    {
        q: "What unique restriction did Israel face in relation to the Gibeonites, and what broader principle does it illustrate?",
        a: [
            "They could not destroy them, showing that covenants can impose limits even on God’s commands",
            "They had to leave Canaan, showing consequences are immediate for broken promises",
            "They lost their national identity, showing disobedience erases spiritual heritage",
            "They stopped worshiping God, showing sin leads to covenant annulment"
        ],
        correct: 0
    },
    {
        q: "Israel’s inability to break the Gibeonite covenant demonstrates what enduring principle about covenants?",
        a: [
            "Covenants possess binding force that can shape decisions and influence generational destiny",
            "Covenants can be bypassed when inconvenient if people pray hard enough",
            "Only covenants documented in writing carry real authority",
            "God overlooks poorly made covenants for the sake of mercy"
        ],
        correct: 0
    },
    {
        q: "In 2 Samuel 21, consequences appeared generations later. What does this teach about covenantal obligations?",
        a: [
            "They transcend time, affecting outcomes long after initial agreement",
            "God randomly enacts delayed consequences for divine purposes",
            "New covenants can retroactively nullify previous ones",
            "Human forgetfulness negates covenantal responsibility"
        ],
        correct: 0
    },
    {
        q: "What is the spiritual risk associated with entering covenants carelessly, according to the lesson?",
        a: [
            "It can create lasting hindrances to blessings and limit divine favor",
            "It automatically ensures short-term success without long-term effects",
            "It has no real impact beyond human emotions",
            "It can always be undone through human effort alone"
        ],
        correct: 0
    },
    {
        q: "How does the lesson portray God’s faithfulness in relation to covenants, even when humans fail?",
        a: [
            "God is unwavering and always remembers and honors His covenants",
            "God abandons covenants if humans are unfaithful",
            "God delegates covenant enforcement exclusively to angels",
            "God remains neutral unless humans actively remind Him"
        ],
        correct: 0
    },
    {
        q: "For those suffering due to harmful or restrictive covenants, what solution does the lesson prescribe?",
        a: [
            "Approaching Jesus for liberation and restoration of rightful blessings",
            "Ignoring the covenant and hoping for natural resolution",
            "Creating new covenants to overwrite old ones",
            "Relying on time to eventually erase the impact of the covenant"
        ],
        correct: 0
    },
    {
        q: "What is the deeper lesson believers should internalize from understanding the strength of covenants?",
        a: [
            "To discern carefully before entering any covenant and to honor godly commitments faithfully",
            "To avoid all commitments, as covenants are spiritually dangerous",
            "To focus on personal benefit rather than spiritual integrity",
            "To treat covenants as mere symbolic rituals without real consequence"
        ],
        correct: 0
    }
];


const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50);
    const [showResults, setShowResults] = useState(false);
    const [faithRating, setFaithRating] = useState(5);
    const [commitments, setCommitments] = useState<
        Array<{ text: string; date: string }>
    >([]);
    const [commitmentInput, setCommitmentInput] = useState("");
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };

    
   const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "January 4, 2026",
    lessonTitle: "The Strength of Covenant – Part 4",

    memoryVerse:
        "According to the word that I covenanted with you when ye came out of Egypt, so my spirit remaineth among you: fear ye not. - Haggai 2:5",
    memoryVerseRef: "Haggai 2:5",

    introScriptures: ["Joshua 9:14-19", "2 Samuel 21:1-9"],
    lessonIntroScriptures: [],

    introduction:
        "From what we have learnt so far, it is quite obvious that covenants are a serious commitment that should be entered into very carefully. It was the covenant Israel entered with unbelieving Gibeon carelessly that both ensnared them and became a deterrent to receiving their inheritance.",

    aims:
        "To reveal the implications of covenants since man is surrounded or is obliged to surround himself by it.",

    objectives:
        "To cause man to be mindful of holy covenants and discard evil covenants through Christ.",

    lessonIntro:
        "In our last lesson, we realized that there is need for proper investigation before commitment. God’s condition of covenant and time that hides the truth from the present were also in focus. Today we will look into more revelation that this lesson provides.",

    lessonPoints: [
        {
            title: "The Record – Verse 18",
            content:
                "Every covenant goes into record as soon as it is agreed and pronounced. The Israelites initiated the covenant in verse 18. There is a book that records covenants whether visible or invisible, see Exo. 24:7 Any party may forget due to length of time, but covenant records never expire.",
            scriptures: ["Joshua 9:18", "Exodus 24:7"],
            subPoints: [],
        },
        {
            title: "Covenants Are Remembered",
            content:
                "Any party to a covenant may forget or disrespect it, but the witness will not forget. Many assume commitments fade with time, but the divine witness does not live in time, therefore the covenant remains fresh in His mind. See Leviticus 26:45",
            scriptures: ["Leviticus 26:45"],
            subPoints: [],
        },
        {
            title: "Close to the Heart of the Witness",
            content:
                "A covenant touches the reputation, credibility, name, and personality of the witness. If it is not handled properly and fairly, people will lose confidence and desert him. Psalm 111:5",
            scriptures: ["Psalm 111:5"],
            subPoints: [],
        },
        {
            title: "The Restrictions",
            content:
                "God gave the land of the Canaanites to Israel and commanded them to dispossess and destroy them. However, Israel could not do this with the Gibeonites because a covenant restricted them - see verse 18, 19. Many covenants today also serve as hindrances to mankind.",
            scriptures: ["Joshua 9:18-19"],
            subPoints: [],
        },
    ],

    conclusion:
        "Do you have a covenant? Do you know if you are denied blessings because of a covenant? If so, come to Jesus, for He is willing to set you free.",

    conclusionScriptures: ["Matthew 11:28"],

    prayerPoints: [
        "Father, open my eyes to understand every covenant affecting my life.",
        "Lord Jesus, set me free from every evil covenant working against my destiny.",
        "Holy Spirit, help me honor holy covenants and walk in obedience.",
        "Father, let every covenant hindering my inheritance be broken through Christ.",
        "Lord, teach me wisdom and caution before entering into any covenant.",
    ],
});


    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (quizActive && timeLeft > 0 && !showResults) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizActive, timeLeft, showResults]);

    const startQuiz = () => {
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(50);
        setShowResults(false);
    };

    const checkAnswer = (choice: number) => {
        if (!quizActive || showResults) return;
        const correct = quizQuestions[currentQuestion].correct === choice;
        const timeBonus = Math.floor(timeLeft / 10);
        const points = correct ? 10 + timeBonus : 0;
        if (correct) setScore((prev) => prev + points);
        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuestion((prev) => prev + 1), 1000);
        } else {
            setTimeout(() => endQuiz(), 1000);
        }
    };

    const endQuiz = () => {
        setQuizActive(false);
        setShowResults(true);
    };

    const addCommitment = () => {
        if (commitmentInput.trim()) {
            setCommitments((prev) => [
                ...prev,
                {
                    text: commitmentInput,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setCommitmentInput("");
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";

    if (appLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                                style={{ animationDelay: "0.3s" }}
                            ></div>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Life Gate Ministries Worldwide
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Sunday School Lessons
                    </p>
                    <div className="text-white/80 mb-6 text-lg animate-pulse">
                        Loading Sunday School Lesson...
                    </div>
                    <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-white/70 mt-3 text-sm">
                        {loadingProgress}%
                    </p>
                </div>
            </div>
        );
    }

    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            The Strength of Covenant - Part 4
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "application",
                        "quiz",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: Joshua 9:14-19, 2 Samuel 21:1-9
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Joshua 9:14-19"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <BookOpen size={16} />
                                            Read Joshua 9:14-19
                                        </button>
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "2 Samuel 21:1-9"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <BookOpen size={16} />
                                            Read 2 Samuel 21:1-9
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                        </p>
                                    )}
                                   
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
                




    {activeTab === "application" && (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-4">
            Personal Application
        </h3>
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Your Awareness and Response to Covenants
            </h4>
            <p className="mb-4">
                On a scale of 1 to 10, indicate how aware you are of covenants in your life and how consistently you honor or respond to them — spiritually, relationally, and personally.
            </p>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={faithRating}
                    onChange={(e) =>
                        setFaithRating(Number(e.target.value))
                    }
                    className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-600">
                    {faithRating}/10
                </span>
            </div>
            <p className="mt-3 text-sm italic">
                {faithRating >= 8
                    ? "Excellent! You are mindful of covenants and honoring God through your actions."
                    : faithRating >= 5
                    ? "Good! Reflect on areas where you can better discern and honor covenants."
                    : "Consider learning more about covenants and how to align your actions with God’s principles."}
            </p>
        </div>
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-white border border-gray-200"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Personal Covenant Commitments
            </h4>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={commitmentInput}
                    onChange={(e) =>
                        setCommitmentInput(e.target.value)
                    }
                    placeholder="Enter a personal commitment to honor, activate, or reject covenants according to God’s Word..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                        darkMode
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                    }`}
                    onKeyPress={(e) =>
                        e.key === "Enter" && addCommitment()
                    }
                />
                <button
                    onClick={addCommitment}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Save size={16} /> Save
                </button>
            </div>
            <div className="space-y-2">
                {commitments.map((commitment, idx) => (
                    <div
                        key={idx}
                        className={`${
                            darkMode
                                ? "bg-gray-800"
                                : "bg-gray-50"
                        } p-3 rounded-lg flex items-start gap-3`}
                    >
                        <CheckCircle
                            className="text-green-600 mt-1"
                            size={20}
                        />
                        <div className="flex-1">
                            <p>{commitment.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {commitment.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-sm italic text-gray-500">
                Use this section to reflect on covenants in your life — whether holy or ungodly — and write down practical steps to honor, reactivate, or break them through Christ. Consider how understanding covenants can impact your relationships, decisions, and spiritual growth.
            </p>
        </div>
    </div>
)}








                        {activeTab === "quiz" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Speed Quiz Challenge
                                    </h3>
                                    {quizActive && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-600" />
                                                <span className="text-xl font-bold">
                                                    {timeLeft}s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-yellow-600" />
                                                <span className="text-xl font-bold">
                                                    {score}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!quizActive && !showResults && (
                                    <div className="text-center py-12">
                                        <Award
                                            size={64}
                                            className="mx-auto mb-4 text-yellow-600"
                                        />
                                        <h4 className="text-2xl font-bold mb-4">
                                            Ready to Test Your Knowledge?
                                        </h4>
                                        <p className="mb-6 text-lg">
                                            Answer quickly for bonus points!
                                        </p>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                                {quizActive && !showResults && (
                                    <div>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-blue-50"
                                            } p-6 rounded-lg mb-6`}
                                        >
                                            <h4 className="text-xl font-semibold mb-4">
                                                Question {currentQuestion + 1}{" "}
                                                of {quizQuestions.length}
                                            </h4>
                                            <p className="text-lg mb-6">
                                                {
                                                    quizQuestions[
                                                        currentQuestion
                                                    ].q
                                                }
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quizQuestions[
                                                    currentQuestion
                                                ].a.map((answer, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            checkAnswer(idx)
                                                        }
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-800 hover:bg-gray-900"
                                                                : "bg-white hover:bg-gray-50"
                                                        } p-4 rounded-lg border-2 border-blue-600 transition transform hover:scale-105 text-left`}
                                                    >
                                                        <span className="font-bold text-blue-600 mr-2">
                                                            {String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                            .
                                                        </span>
                                                        {answer}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showResults && (
                                    <div className="text-center space-y-6">
                                        <Award
                                            size={80}
                                            className="mx-auto text-yellow-600"
                                        />
                                        <h4 className="text-3xl font-bold">
                                            Quiz Complete!
                                        </h4>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                            } p-8 rounded-lg`}
                                        >
                                            <p className="text-5xl font-bold text-blue-600 mb-2">
                                                {score}
                                            </p>
                                            <p className="text-xl">
                                                Final Score
                                            </p>
                                            <p className="mt-4 text-lg">
                                                {score >= 100
                                                    ? "Outstanding! Excellent knowledge!"
                                                    : score >= 60
                                                    ? "Great work! Keep studying!"
                                                    : "Good effort! Review the lesson."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
