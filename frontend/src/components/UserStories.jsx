import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const UserStoriesCarousel = () => {
  const stories = [
    {
      name: "Emily Carter",
      role: "Patient",
      text: "The staff made me feel comfortable from the moment I walked in.",
      image: "https://i.pravatar.cc/100?img=4",
    },
    {
      name: "Daniel Smith",
      role: "Visitor",
      text: "Very organized system and minimal waiting time.",
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Sophia Martinez",
      role: "Patient",
      text: "Doctors explained everything clearly and patiently.",
      image: "https://i.pravatar.cc/100?img=6",
    },
    {
      name: "James Anderson",
      role: "Patient",
      text: "Excellent care and modern facilities. Highly impressed.",
      image: "https://i.pravatar.cc/100?img=7",
    },
    {
      name: "Olivia Brown",
      role: "Visitor",
      text: "Friendly staff and a very clean environment.",
      image: "https://i.pravatar.cc/100?img=8",
    },
    {
      name: "Liam Wilson",
      role: "Patient",
      text: "Booking appointments online was quick and easy.",
      image: "https://i.pravatar.cc/100?img=9",
    },
    {
      name: "Noah Taylor",
      role: "Patient",
      text: "The emergency service was fast and efficient.",
      image: "https://i.pravatar.cc/100?img=10",
    },
    {
      name: "Ava Thomas",
      role: "Visitor",
      text: "The hospital atmosphere is calm and reassuring.",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      name: "William Jackson",
      role: "Patient",
      text: "Professional doctors who truly care about patients.",
      image: "https://i.pravatar.cc/100?img=12",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-6xl google-sans-500">
            What our patients say
          </h2>
          <p className="google-sans-400">Read what our patients have to say</p>
        </div>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mask-l-from-91% mask-l-to-100% mask-r-from-91% mask-r-to-100%"
        >
          {stories.map((story, index) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div className="bg-[#d7dada] p-4 rounded-xl shadow-sm mx-8 mb-16">
                <p className="text-gray-700 mb-4 google-sans-400">
                  “{story.text}”
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="google-sans-500">{story.name}</p>
                    <p className="text-sm text-gray-500 google-sans-400">
                      {story.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default UserStoriesCarousel;
