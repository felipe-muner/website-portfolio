// data/blogPosts.ts

// 1. Define an interface for your blog post structure (now with date)
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

// 2. Create an array of BlogPost objects (5 posts with dates)
export const blogPosts: BlogPost[] = [
  {
    slug: "5-essential-workouts-for-busy-travelers",
    title: "5 Essential Workouts for Busy Travelers",
    date: "2025-01-01",
    excerpt: "Short, effective routines to keep you in shape on the go.",
    content: `
      <p>Traveling can throw off your fitness routine, but it doesn't have to. Here are 5 quick workouts you can do with minimal equipment:</p>
      <ol>
        <li><strong>Bodyweight HIIT:</strong> Burpees, squat jumps, and mountain climbers for 20 seconds each, resting 10 seconds in between.</li>
        <li><strong>Chair & Desk Circuit:</strong> Chair dips, desk push-ups, and plank holds using hotel furniture.</li>
        <li><strong>Full-Body Tabata:</strong> Alternate lunges and push-ups for 8 rounds of 20 seconds on, 10 seconds off.</li>
        <li><strong>Core Crusher:</strong> Bicycle crunches, forearm planks, and side planks, each for 30 seconds.</li>
        <li><strong>Resistance Bands:</strong> Pack a lightweight band for rows, bicep curls, and shoulder presses.</li>
      </ol>
      <p>Incorporating any of these five workouts into your day—morning, noon, or night—keeps your routine on track and your body in shape.</p>
    `,
  },
  {
    slug: "keep-your-diet-on-track-while-on-the-road",
    title: "How to Keep Your Diet on Track While on the Road",
    date: "2025-01-02",
    excerpt: "Practical meal planning and snack options for the busy traveler.",
    content: `
      <p>Travel can make healthy eating feel like a challenge, but a little planning goes a long way:</p>
      <ul>
        <li><strong>Pack Healthy Snacks:</strong> Choose nuts, dried fruit, or protein bars to curb hunger between meals.</li>
        <li><strong>Meal Prepping:</strong> If you have access to a kitchenette, cook in batches to avoid fast-food pitfalls.</li>
        <li><strong>Smart Restaurant Choices:</strong> Look for grilled items, salads, and vegetable-based dishes over fried or creamy options.</li>
        <li><strong>Stay Hydrated:</strong> Dehydration can lead to cravings, so keep a refillable water bottle handy.</li>
      </ul>
      <p>Whether you're flying cross-country or road-tripping to a new destination, these tips help you maintain a balanced diet on the go.</p>
    `,
  },
  {
    slug: "best-gym-hacks-for-travelers",
    title: "Best Gym Hacks: From Minimal Equipment to Quick Routines",
    date: "2025-01-03",
    excerpt: "Top tips to get the most out of your travel-friendly workouts.",
    content: `
      <p>Limited gym access or lack of time shouldn’t stop you from working out while traveling. Here are a few hacks to help you hit your fitness goals:</p>
      <ol>
        <li><strong>Use What You Have:</strong> If the hotel gym only has a treadmill and a few dumbbells, focus on high-intensity combos (like sprint intervals + weighted lunges).</li>
        <li><strong>Time Blocking:</strong> Schedule a 20-minute block first thing in the morning to ensure you get a workout before the day's activities begin.</li>
        <li><strong>Pack Lightweight Gear:</strong> Resistance bands and jump ropes are easy to carry and can give you a full-body workout.</li>
        <li><strong>Track Your Progress:</strong> Use a fitness app or simple notebook to log exercises and keep motivated.</li>
      </ol>
      <p>By implementing these simple hacks, you'll stay consistent with your fitness routine, even when your schedule is anything but predictable.</p>
    `,
  },
  {
    slug: "5-travel-friendly-meal-prep-ideas",
    title: "5 Travel-Friendly Meal Prep Ideas",
    date: "2025-01-04",
    excerpt: "Quick, healthy meal preps that pack well and reheat easily.",
    content: `
      <p>Keeping your diet on track while traveling is much easier when you have prepped meals ready to go. Here are five ideas:</p>
      <ul>
        <li><strong>Overnight Oats:</strong> Prep in small containers or jars for a grab-and-go breakfast.</li>
        <li><strong>Protein Boxes:</strong> Hard-boiled eggs, cheese, nuts, and fruit for a balanced snack box.</li>
        <li><strong>Salad Jars:</strong> Layer dressing at the bottom and greens at the top to keep leaves fresh until you're ready to eat.</li>
        <li><strong>Freezer Burritos:</strong> Veggie or chicken burritos that heat up quickly in any microwave.</li>
        <li><strong>Simple Pasta Salads:</strong> Cooked pasta with chopped veggies, a protein source, and a light dressing.</li>
      </ul>
      <p>Plan ahead, pack them in meal-prep containers, and keep them chilled with an insulated bag to ensure you always have a healthy option on hand.</p>
    `,
  },
  {
    slug: "staying-healthy-on-long-haul-flights",
    title: "Staying Healthy on Long-Haul Flights",
    date: "2025-01-05",
    excerpt: "Tips to keep blood flowing and your mind fresh during long flights.",
    content: `
      <p>Long flights can be taxing on the body. Here’s how to stay healthy and comfortable:</p>
      <ol>
        <li><strong>Stay Hydrated:</strong> Airplane cabins are dry; drink water regularly and avoid excessive caffeine or alcohol.</li>
        <li><strong>Move Often:</strong> Get up every couple of hours to stretch your legs, do light calf raises, or walk up and down the aisle.</li>
        <li><strong>In-Seat Exercises:</strong> Neck rolls, shoulder shrugs, and ankle circles help combat stiffness.</li>
        <li><strong>Choose Healthy Snacks:</strong> Carry fruits, nuts, or whole-grain options to avoid high-sugar or high-salt airline snacks.</li>
        <li><strong>Adjust to Local Time:</strong> As soon as you board, set your watch to your destination's time and align your sleep accordingly.</li>
      </ol>
      <p>With the right planning and a few healthy habits, you'll step off the plane feeling far more refreshed and ready for your destination.</p>
    `,
  },
];
