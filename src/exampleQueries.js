// Example queries for Nomikos - curated from Shadow World lore
export const CHAT_EXAMPLES = [
  "Tell me about the assassination of Damos Huroth Alizon II and what happened after",
  "How did Jiax become King of Saral and what was his relationship with the Loremasters?",
  "What role did the Priest of Yarthraak play in governing Helyssa?",
  "Explain how Aldaron unified Emer and became Emperor",
  "What happened during the fight for Uj when Kio Viax faced Andaras?",
  "Tell me about the war between Jan and the Shoneb Empire in Thuul",
  "How did the Blood Brethren defend against Vajaar in the Komari war?",
  "What caused the conflict between the Naal Triumvirate and Ansidus?",
  "Describe the major trade centers like Lethys and Kaitaine",
  "What makes Kakuda unique as an independent city-state?",
  "How does the magic of the three Realms differ from Arcane Power?",
  "What are the Lords of Essænce and how did they master both Flows and mind power?",
  "Tell me about Sea Drakes and their rivalry with whales and giant squid",
  "What are Fell Beasts and how can they be tamed as air steeds?",
  "Describe the war-mongering Lugrôki and their hatred of men and elves",
  "What is Trystrium and why is it so valuable for weapons?",
  "How do Bloodstones work and what makes them single-use?",
  "What protective powers do Bluestones have against essence spells?",
  "Tell me about Eissa's Tears and how they detect evil",
  "What happened in the year 6050 that changed the balance of power?",
  "How did the political situation in Emer change around year 1300?",
  "What were the consequences of the battles in year 3347?",
  "Describe the conflict between Channeling, Essence, and Mentalism users",
  "How do the Nomari survive in their subterranean world?",
  "What makes the Ta-lairi different from both humans and elves?"
];

export const ANSWER_EXAMPLES = [
  "What is Trystrium made from?",
  "How much does Trystrium cost per ounce?",
  "Where is Lethys located?",
  "What year was Damos Huroth Alizon II assassinated?",
  "Who became King of Saral after the assassination?",
  "When did Aldaron crown himself Emperor of Emer?",
  "What is the wingspan of a Fell Beast?",
  "How tall are Hill Giants?",
  "What do Bloodstones do?",
  "What color is Trystrium metal?",
  "Where is Yarlis City?",
  "What are the three Realms of magic?",
  "What realm does Channeling belong to?",
  "What realm does Essence belong to?",  
  "What realm does Mentalism belong to?",
  "What happened in year 5975?",
  "What happened in year 5599?",
  "What is Kakuda known for?",
  "What gems are attuned to Essence magic?",
  "What gems are attuned to Channeling magic?",
  "What gems are attuned to Mentalism magic?",
  "What do Eissa's Tears look like?",
  "Where is Trystrium found?",
  "What are Sea Drakes?",
  "What is the Grotto Path?"
];

export const SEARCH_EXAMPLES = [
  "Damos Huroth Alizon II",
  "Jiax King of Saral",
  "Priest of Yarthraak",
  "Aldaron Emperor",
  "Kio Viax titan",
  "Prince Kier",
  "Lethys trade center",
  "Kaitaine city-state",
  "Kakuda Haid",
  "Yarlis City",
  "Ketalnor",
  "Trystrium metal",
  "Bloodstone gem",
  "Bluestone protection",
  "Eissa's Tears",
  "Sea Drakes ocean",
  "Fell Beasts dragons",
  "Hill Giants",
  "Lugrôki warriors",
  "Nomari subterranean",
  "Ta-lairi blood",
  "three Realms magic",
  "Channeling Essence Mentalism",
  "Arcane Power",
  "Lords of Essænce"
];

// Function to get random examples
export function getRandomExamples(examples, count = 3) {
  const shuffled = [...examples].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
