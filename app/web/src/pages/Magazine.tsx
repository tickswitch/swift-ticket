import Discover from "@/components/Magazine/Discover";
import Container from "@/components/Common/Container";
const discoverData = [
  {
    id: 1,
    category: "Sports",
    name: "Ziggo Dome",
    description:
      "Expect two mind blowing days with a huge technoled international lineup.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1:
      " What You Need to Know About the 2025 Formula One World Championship",
    bodyDescription1:
      " The 2025 F1 season features 24 races, kicking off in March in Australia and wrapping up in December in Abu Dhabi, promising a thrilling year of motorsport.New additions to the calendar include the Circuit of Americas and Las Vegas Grand Prix, enhancing the diversity of race experiences for fans.Key events like the British Grand Prix and the Abu Dhabi Grand Prix offer not only intense competitions but also unique fan experiences, including live music and tech talks.",

    bodyTittle2: "Looking for the 2025 F1 schedule?",
    bodyDescription2:
      "From March to December, the 2025 schedule features 24 Grands Prix, including new and iconic venues. Keep reading for the comprehensive calendar and ",

    videoLink: "hQYRDNl-lGI",
    vtittle1: "The Complete 2025 F1 Schedule & Must-Watch Events",
    vPlace1: "Pre-Season Testing (February 19-21) – Bahrain, Sakhir",
    vdescription1:
      "Before the lights go out for the first race, teams hit the track in Bahrain for crucial pre-season testing. This is the first chance to see the 2025 cars in action, as drivers push their new machines to the limit under the desert sun. With teams fine-tuning setups and assessing performance, testing offers a unique behind-the-scenes glimpse into the season ahead.",
    vtittle2: "March: A Classic Start Down Under",
    vPlace2: "Australian Grand Prix (March 14-16) – Melbourne",
    vdescription2:
      "The season kicks off at Albert Park, bringing the excitement of Formula 1 back to its traditional opening venue. This high-speed street circuit, set around a picturesque lake, challenges drivers with its tricky corners and rapid straights.",
  },
  {
    id: 2,
    category: "Music",
    name: "Tomorrowland 2025",
    description: "Experience electrifying nights at one of the world's largest EDM festivals with over 100 top DJs.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "What Awaits You at Tomorrowland 2025",
    bodyDescription1:
      "From heart-thumping beats to magical stage designs, Tomorrowland 2025 promises a once-in-a-lifetime musical experience. The lineup includes international sensations, vibrant visuals, and immersive light shows. Expect unforgettable performances across 15 massive stages.",

    bodyTittle2: "Where and When?",
    bodyDescription2:
      "Tomorrowland 2025 will take place in Boom, Belgium over two weekends in July. Make sure to secure your ticket early and prepare for the most magical party of your life!",

    videoLink: "MDUWrhwnqJk",
    vtittle1: "Festival Preview & Stage Reveals",
    vPlace1: "Main Stage Reveal – July 18",
    vdescription1:
      "The main stage reveal showcases this year’s theme in a grand unveiling. Expect pyrotechnics, lasers, and an opening ceremony that sets the tone for the entire weekend.",

    vtittle2: "Top DJs You Can't Miss",
    vPlace2: "Live from Freedom Stage – July 20",
    vdescription2:
      "Catch world-renowned DJs like Martin Garrix and Armin van Buuren performing exclusive sets that blend melody, bass, and jaw-dropping visuals in perfect harmony.",
  },
  {
    id: 3,
    category: "Tech",
    name: "Innovate 2025 Summit",
    description: "A global platform where technology leaders present breakthrough innovations and digital strategies.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "Discover the Future of Tech at Innovate 2025",
    bodyDescription1:
      "This year's Innovate Summit features keynote speeches from leaders in AI, cybersecurity, and green tech. Explore how startups and Fortune 500 companies are shaping the next decade of innovation.",

    bodyTittle2: "Why You Should Attend",
    bodyDescription2:
      "With over 10,000 attendees, networking sessions, and live demos, Innovate 2025 is the place to build connections, gain insights, and stay ahead of trends.",

    videoLink: "FpLNFPzttX8",
    vtittle1: "Opening Keynote by Tech Visionaries",
    vPlace1: "Main Stage – March 3",
    vdescription1:
      "Industry leaders discuss the ethical use of AI, privacy in a connected world, and how digital transformation is reshaping industries from the ground up.",

    vtittle2: "Startup Showdown: Who Will Win?",
    vPlace2: "Pitch Arena – March 4",
    vdescription2:
      "Ten startups compete for $1 million in funding by pitching disruptive solutions to real-world problems. Watch as judges challenge ideas and uncover the next tech unicorn.",
  }, 
  {
    id: 4,
    category: "Education",
    name: "Global Quiz Fest",
    description: "A thrilling knowledge battle where teams from 30 countries compete in science, history, and pop culture.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "Get Ready for the Ultimate Quiz Showdown",
    bodyDescription1:
      "The Global Quiz Fest brings high-stakes competition and high-energy fun as the world’s smartest minds go head-to-head. Expect tricky questions, passionate debates, and surprising trivia.",

    bodyTittle2: "Who Will Be the Quiz Champion?",
    bodyDescription2:
      "With regional and global rounds, the competition tests mental agility, teamwork, and general knowledge. Join us to cheer for your country!",

    videoLink: "SDvRK7v7q9I",
    vtittle1: "Highlights from Previous Seasons",
    vPlace1: "Grand Arena – April 10",
    vdescription1:
      "Catch the most intense moments and clever answers that defined last year’s quiz battle. A treat for trivia lovers everywhere.",

    vtittle2: "Live Finals Preview",
    vPlace2: "Main Stage – April 15",
    vdescription2:
      "As the top 5 teams prepare to clash, we break down the players to watch and quiz formats that could determine who wins it all.",
  }, 
  {
    id: 5,
    category: "Film",
    name: "CineVerse 2025",
    description: "A film festival where indie meets blockbuster — premieres, director panels, and immersive screenings await.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "What to Expect at CineVerse 2025",
    bodyDescription1:
      "From world premieres to thought-provoking documentaries, CineVerse delivers a cinematic journey that celebrates creativity, culture, and storytelling. Rub shoulders with actors, directors, and critics in an artistic atmosphere.",

    bodyTittle2: "Event Schedule and Key Films",
    bodyDescription2:
      "Running from May 2–10, the festival includes daily red carpet events, special screenings, and Q&A sessions with international filmmakers.",

    videoLink: "SDvRK7v7q9I",
    vtittle1: "Opening Night Gala",
    vPlace1: "CineVerse Theater – May 2",
    vdescription1:
      "Join the red carpet celebration as the festival opens with a powerful drama that’s already gaining Oscar buzz. Live interviews and behind-the-scenes sneak peeks included.",

    vtittle2: "Top Films to Watch",
    vPlace2: "Hall B – May 5",
    vdescription2:
      "From thrillers to animations, we highlight the five films that are drawing critical acclaim and standing ovations from audiences around the world.",
  },
  {
    id: 1,
    category: "Sports",
    name: "Ziggo Dome",
    description:
      "Expect two mind blowing days with a huge technoled international lineup.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1:
      " What You Need to Know About the 2025 Formula One World Championship",
    bodyDescription1:
      " The 2025 F1 season features 24 races, kicking off in March in Australia and wrapping up in December in Abu Dhabi, promising a thrilling year of motorsport.New additions to the calendar include the Circuit of Americas and Las Vegas Grand Prix, enhancing the diversity of race experiences for fans.Key events like the British Grand Prix and the Abu Dhabi Grand Prix offer not only intense competitions but also unique fan experiences, including live music and tech talks.",

    bodyTittle2: "Looking for the 2025 F1 schedule?",
    bodyDescription2:
      "From March to December, the 2025 schedule features 24 Grands Prix, including new and iconic venues. Keep reading for the comprehensive calendar and ",

    videoLink: "hQYRDNl-lGI",
    vtittle1: "The Complete 2025 F1 Schedule & Must-Watch Events",
    vPlace1: "Pre-Season Testing (February 19-21) – Bahrain, Sakhir",
    vdescription1:
      "Before the lights go out for the first race, teams hit the track in Bahrain for crucial pre-season testing. This is the first chance to see the 2025 cars in action, as drivers push their new machines to the limit under the desert sun. With teams fine-tuning setups and assessing performance, testing offers a unique behind-the-scenes glimpse into the season ahead.",
    vtittle2: "March: A Classic Start Down Under",
    vPlace2: "Australian Grand Prix (March 14-16) – Melbourne",
    vdescription2:
      "The season kicks off at Albert Park, bringing the excitement of Formula 1 back to its traditional opening venue. This high-speed street circuit, set around a picturesque lake, challenges drivers with its tricky corners and rapid straights.",
  },
  {
    id: 2,
    category: "Music",
    name: "Tomorrowland 2025",
    description: "Experience electrifying nights at one of the world's largest EDM festivals with over 100 top DJs.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "What Awaits You at Tomorrowland 2025",
    bodyDescription1:
      "From heart-thumping beats to magical stage designs, Tomorrowland 2025 promises a once-in-a-lifetime musical experience. The lineup includes international sensations, vibrant visuals, and immersive light shows. Expect unforgettable performances across 15 massive stages.",

    bodyTittle2: "Where and When?",
    bodyDescription2:
      "Tomorrowland 2025 will take place in Boom, Belgium over two weekends in July. Make sure to secure your ticket early and prepare for the most magical party of your life!",

    videoLink: "MDUWrhwnqJk",
    vtittle1: "Festival Preview & Stage Reveals",
    vPlace1: "Main Stage Reveal – July 18",
    vdescription1:
      "The main stage reveal showcases this year’s theme in a grand unveiling. Expect pyrotechnics, lasers, and an opening ceremony that sets the tone for the entire weekend.",

    vtittle2: "Top DJs You Can't Miss",
    vPlace2: "Live from Freedom Stage – July 20",
    vdescription2:
      "Catch world-renowned DJs like Martin Garrix and Armin van Buuren performing exclusive sets that blend melody, bass, and jaw-dropping visuals in perfect harmony.",
  },
  {
    id: 3,
    category: "Tech",
    name: "Innovate 2025 Summit",
    description: "A global platform where technology leaders present breakthrough innovations and digital strategies.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "Discover the Future of Tech at Innovate 2025",
    bodyDescription1:
      "This year's Innovate Summit features keynote speeches from leaders in AI, cybersecurity, and green tech. Explore how startups and Fortune 500 companies are shaping the next decade of innovation.",

    bodyTittle2: "Why You Should Attend",
    bodyDescription2:
      "With over 10,000 attendees, networking sessions, and live demos, Innovate 2025 is the place to build connections, gain insights, and stay ahead of trends.",

    videoLink: "FpLNFPzttX8",
    vtittle1: "Opening Keynote by Tech Visionaries",
    vPlace1: "Main Stage – March 3",
    vdescription1:
      "Industry leaders discuss the ethical use of AI, privacy in a connected world, and how digital transformation is reshaping industries from the ground up.",

    vtittle2: "Startup Showdown: Who Will Win?",
    vPlace2: "Pitch Arena – March 4",
    vdescription2:
      "Ten startups compete for $1 million in funding by pitching disruptive solutions to real-world problems. Watch as judges challenge ideas and uncover the next tech unicorn.",
  }, 
  {
    id: 4,
    category: "Education",
    name: "Global Quiz Fest",
    description: "A thrilling knowledge battle where teams from 30 countries compete in science, history, and pop culture.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "Get Ready for the Ultimate Quiz Showdown",
    bodyDescription1:
      "The Global Quiz Fest brings high-stakes competition and high-energy fun as the world’s smartest minds go head-to-head. Expect tricky questions, passionate debates, and surprising trivia.",

    bodyTittle2: "Who Will Be the Quiz Champion?",
    bodyDescription2:
      "With regional and global rounds, the competition tests mental agility, teamwork, and general knowledge. Join us to cheer for your country!",

    videoLink: "SDvRK7v7q9I",
    vtittle1: "Highlights from Previous Seasons",
    vPlace1: "Grand Arena – April 10",
    vdescription1:
      "Catch the most intense moments and clever answers that defined last year’s quiz battle. A treat for trivia lovers everywhere.",

    vtittle2: "Live Finals Preview",
    vPlace2: "Main Stage – April 15",
    vdescription2:
      "As the top 5 teams prepare to clash, we break down the players to watch and quiz formats that could determine who wins it all.",
  }, 
  {
    id: 5,
    category: "Film",
    name: "CineVerse 2025",
    description: "A film festival where indie meets blockbuster — premieres, director panels, and immersive screenings await.",
    bgImage1: "",
    bgImage2: "",

    bodyTittle1: "What to Expect at CineVerse 2025",
    bodyDescription1:
      "From world premieres to thought-provoking documentaries, CineVerse delivers a cinematic journey that celebrates creativity, culture, and storytelling. Rub shoulders with actors, directors, and critics in an artistic atmosphere.",

    bodyTittle2: "Event Schedule and Key Films",
    bodyDescription2:
      "Running from May 2–10, the festival includes daily red carpet events, special screenings, and Q&A sessions with international filmmakers.",

    videoLink: "SDvRK7v7q9I",
    vtittle1: "Opening Night Gala",
    vPlace1: "CineVerse Theater – May 2",
    vdescription1:
      "Join the red carpet celebration as the festival opens with a powerful drama that’s already gaining Oscar buzz. Live interviews and behind-the-scenes sneak peeks included.",

    vtittle2: "Top Films to Watch",
    vPlace2: "Hall B – May 5",
    vdescription2:
      "From thrillers to animations, we highlight the five films that are drawing critical acclaim and standing ovations from audiences around the world.",
  },
];

const Magazine = () => {
  return (
    <div className="bg-[#F4F4F4] py-[50px] min-h-screen">
      <Container>
        <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold"> Discover</p>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {discoverData.map((data) => (
            <Discover key={data.id} data={data} />
          ))}
        </div>
        
      </Container>
     
    </div>
  );
};

export default Magazine;
