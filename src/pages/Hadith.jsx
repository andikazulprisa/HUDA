import { useEffect } from "react";

function Hadith() {
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-bukhari.json",
        );

        const result = await response.json();

        console.log("Hadith API:", result);
        console.log("Jumlah hadis:", result.hadiths.length);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    testApi();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-32">
      <h1 className="text-3xl font-semibold text-emerald-950">Hadis</h1>
    </main>
  );
}

export default Hadith;
