// const data: any[] = [
//   {
//     value: 1,
//     label: "Top",
//     children: [
//       {
//         value: 3,
//         label: "Top_1",
//         children: [
//           {
//             value: 6,
//             label: "Top_1_1",
//           },
//         ],
//       },
//       {
//         value: 4,
//         label: "Top_2",
//         children: [
//           {
//             value: 7,
//             label: "Top_2_1",
//           },
//         ],
//       },
//       {
//         value: 5,
//         label: "Top_3",
//         children: [
//           {
//             value: 8,
//             label: "Top_3_1",
//             children: [
//               {
//                 value: 9,
//                 label: "Top_3_1_1",
//                 children: [
//                   {
//                     value: 10,
//                     label: "Top_3_1_1_1",
//                   },
//                 ],
//               },
//               {
//                 value: 11,
//                 label: "Top_3_1_2",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: 2,
//     label: "Bottom",
//     children: [
//       {
//         value: 12,
//         label: "Bottom 1",
//       },
//     ],
//   },
// ];

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注冊 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 定義每個區塊的數據
const sections = [
  {
    id: 1,
    title: "第一個區塊",
    subtitle: "滾動看我縮小",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
  },
  {
    id: 2,
    title: "第二個區塊",
    subtitle: "我會堆疊在第一個上面",
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
  },
  {
    id: 3,
    title: "第三個區塊",
    subtitle: "繼續向下滾動",
    gradient: "from-green-600 via-emerald-500 to-lime-400",
  },
  {
    id: 4,
    title: "第四個區塊",
    subtitle: "最後一個啦！",
    gradient: "from-red-600 via-rose-500 to-pink-400",
  },
];

const Page = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 使用新的 gsap.matchMedia API
    const mm = gsap.matchMedia();

    // 為每個區塊創建動畫
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const cardSize = 150;
      const padding = 15;
      const paddingY = -25;
      const stackOffset = index * 10;

      const finalScale = cardSize / window.innerWidth;
      const finalX =
        -(window.innerWidth / 2) + cardSize / 2 + padding + stackOffset;
      const finalY =
        -(window.innerHeight / 2) + cardSize / 2 + paddingY + stackOffset;

      // 新的 API 寫法
      mm.add("(min-width: 0px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            endTrigger: document.body,
            end: "bottom bottom",
            scrub: 1,
            pin: true,
            pinSpacing: false,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          section,
          {
            scale: finalScale,
            x: finalX,
            y: finalY,
            borderRadius: "20px",
            ease: "power2.out",
            duration: 0.3,
          },
          0
        );

        tl.to(section, { duration: 0.7 }, 0.3);

        // 返回清理函數（matchMedia 會自動處理）
        return () => {
          tl.kill();
        };
      });
    });

    // 清理函數
    return () => {
      mm.revert(); // 新 API 的清理方式
    };
  }, []);

  return (
    <div className="relative bg-gray-950">
      {/* 渲染所有可堆疊的區塊 */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className={`relative w-screen h-screen flex items-center justify-center bg-linear-to-br ${section.gradient}`}
          style={{
            zIndex: sections.length - index, // 確保後面的區塊在上層
          }}
        >
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">{section.title}</h1>
            <p className="text-2xl">{section.subtitle}</p>
            <p className="text-lg mt-4 opacity-70">
              區塊 {section.id} / {sections.length}
            </p>
          </div>
        </div>
      ))}

      {/* 添加額外的滾動空間，確保所有動畫都能完成 */}
      <div className="relative min-h-[300vh] bg-gray-950 text-white p-20">
        <div className="max-w-4xl mx-auto pt-40">
          <h2 className="text-5xl font-bold mb-8 text-center">
            所有卡片都已堆疊在左上角 🎉
          </h2>
          <p className="text-xl mb-12 text-center text-gray-400">
            向上滾動可以看到卡片一直固定在左上方
          </p>

          <div className="space-y-12 mt-20">
            <div className="bg-gray-900/50 p-12 rounded-2xl border border-gray-800 backdrop-blur">
              <h3 className="text-3xl font-bold mb-6">✨ 效果說明</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                這是一個經典的「Card
                Stack」動畫效果。每個區塊在滾動時會縮小並移動到左上角，
                然後永久固定在那裡，後續的區塊會依次堆疊上去，形成一個漂亮的卡片堆疊效果。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-900/30 p-8 rounded-xl border border-purple-700/50">
                <h4 className="text-2xl font-semibold mb-4 text-purple-300">
                  🎯 應用場景
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• 產品特性展示</li>
                  <li>• 作品集展示</li>
                  <li>• 時間軸故事</li>
                  <li>• 服務項目介紹</li>
                </ul>
              </div>

              <div className="bg-blue-900/30 p-8 rounded-xl border border-blue-700/50">
                <h4 className="text-2xl font-semibold mb-4 text-blue-300">
                  ⚙️ 可調整參數
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• cardSize: 卡片大小</li>
                  <li>• padding: 邊距</li>
                  <li>• stackOffset: 堆疊偏移</li>
                  <li>• scrub: 動畫速度</li>
                </ul>
              </div>
            </div>

            {/* 更多內容區塊 */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-900/30 p-10 rounded-xl border border-gray-700/50"
              >
                <h4 className="text-2xl font-semibold mb-4">內容區塊 {i}</h4>
                <p className="text-gray-400">
                  這裡可以放置更多內容。卡片會一直保持在左上角，
                  你可以繼續添加任何內容在這裡。滾動時可以看到左上角的卡片堆疊效果始終存在。
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
