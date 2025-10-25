import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import Image from "next/image";

export const metadata = getMetadata({ routeName: "Our Team" });

export default function OurTeam() {
  const team = [
    {
      name: "Vanessa",
      role: "Pilates Mobility Instructor",
      image: "/img/team/team-1.jpg",
      bio: "Sample bio.",
      certifications: [
        "Foundation & Basic Mat Pilates by Conscious Movement Education - a training school",
        "Pilates Equipment / Reformer by Conscious Movement Education - a training school"
      ]
    },
    {
      name: "Steve",
      role: "HIIT & Tabata Instructor",
      image: "/img/team/team-2.jpg",
      bio: "Sample bio.",
      certifications: []
    },
    {
      name: "Diana",
      role: "CrossFit Coach",
      image: "/img/team/team-3.jpg",
      bio: "Sample bio.",
      certifications: [
        "Diploma of Sports Science",
        "Crossfit Trainer Certificate Level 1 and Level 2",
        "Crossfit Trainer Certificate Weightlifting",
        "Crossfit Trainer Certificate Gymnastics"
      ]
    },
    {
      name: "Daniel",
      role: "CrossFit Coach",
      image: "/img/team/team-5.jpg",
      bio: "Sample bio.",
      certifications: [
        "Graduate of a sports institute",
        "Crossfit Trainer Certificate Level 2"
      ]
    },
    {
      name: "Carlene",
      role: "Max Power Mobility Instructor",
      image: "/img/team/team-6.jpg",
      bio: "",
      certifications: []
    },
    {
      name: "Jace",
      role: "Primal Power Yoga Instructor",
      image: "/img/team/team-4.jpg",
      bio: "",
      certifications: []
    },
  ];

  return (
    <>
      <Breadcrumb route={'Our Team'} />
      <div className="flex flex-col gap-8 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[1200px] font-mulish">
        <h1 className="text-4xl font-semibold text-white text-center w-full">Our Team</h1>
        <p className="text-center w-full">Meet the amazing team of coaches and trainers who are here to help you achieve your fitness goals.</p>

        <div className="grid grid-cols-1 gap-12 w-full mt-8">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col md:flex-row gap-6 p-8 bg-brand-gray-dark rounded-lg">
              <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <h2 className="text-3xl font-semibold text-white">{member.name}</h2>
                  <p className="text-brand-orange text-lg">{member.role}</p>
                </div>
                {member.bio && (
                  <p className="text-brand-gray-medium leading-relaxed">{member.bio}</p>
                )}
                {member.certifications && member.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Certifications</h3>
                    <ul className="list-disc list-inside space-y-1 text-brand-gray-medium">
                      {member.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
