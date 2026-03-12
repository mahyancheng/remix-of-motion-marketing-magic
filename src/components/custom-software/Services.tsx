import { motion } from "framer-motion";

const items = [
  {
    title: "Healthcare Software Solutions",
    pain: "Still managing patient records on paper?",
    desc: "Patient management systems, appointment booking, electronic health records, and HIPAA-compliant platforms that eliminate errors and save hours daily.",
  },
  {
    title: "ERP Systems",
    pain: "Drowning in disconnected spreadsheets?",
    desc: "Enterprise resource planning systems for inventory, finance, HR, and operations — all in one place, talking to each other.",
  },
  {
    title: "Customer Help Desk Platforms",
    pain: "Customers waiting hours for a response?",
    desc: "Ticketing systems, live chat solutions, and customer support automation that resolve issues 3x faster.",
  },
  {
    title: "Business Automation Software",
    pain: "Your team doing the same task 50 times a day?",
    desc: "Workflow automation, document processing, and task management systems that eliminate manual overhead and human errors.",
  },
  {
    title: "CRM & Sales Systems",
    pain: "Losing track of leads and forgetting follow-ups?",
    desc: "Customer relationship management platforms like our flagship Howkee CRM — never lose a lead again.",
  },
  {
    title: "Building Automation System Software",
    pain: "Energy bills through the roof?",
    desc: "IoT-enabled monitoring and control systems to optimize building efficiency and cut energy costs by 20-40%.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">
            We Build the Systems Your Business <span className="text-gradient">Actually Needs</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            End-to-end custom software by a software company in Malaysia. We don't sell features — we solve problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-destructive font-medium mb-2 italic">{item.pain}</p>
              <h3 className="text-lg md:text-xl font-display font-semibold mb-2 text-accent min-h-[48px]">
                {item.title}
              </h3>
              <p className="text-xs md:text-md text-muted-foreground flex-grow">
                {item.desc}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-10 rounded-2xl border border-accent/30 bg-card p-6 shadow-card shadow-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-accent">
            Featured Project: Howkee CRM
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
            <div>
              <p className="text-sm md:text-md text-muted-foreground mb-2">
                <strong className="text-foreground">The Problem:</strong> A Malaysian sales team was losing 40% of leads because follow-ups fell through the cracks.
              </p>
              <p className="text-sm md:text-md text-muted-foreground mb-4">
                <strong className="text-accent">The Result:</strong> Howkee CRM automated their pipeline, and they recovered RM200K in lost revenue within 3 months.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <span>Customer lifecycle management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <span>Sales pipeline automation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <span>Multi-language support (English/Malay/Chinese)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <span>Integration with Malaysian banking systems</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
                alt="Howkee CRM Dashboard"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
