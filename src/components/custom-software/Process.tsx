import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "The Deep Dive", desc: "We don't just ask what you want — we study your operations, find the bottlenecks costing you money, and map out the system that eliminates them." },
  { n: "02", title: "Blueprint & Prototype", desc: "Before writing a single line of code, you see and test a working prototype. No surprises. No 'that's not what I wanted.' Zero risk." },
  { n: "03", title: "Build & Integrate", desc: "Our team builds your system and integrates it with your existing tools — CRM, ERP, payment gateways, WhatsApp, whatever you need." },
  { n: "04", title: "Launch & Optimize", desc: "We don't just hand it off and disappear. We launch, train your team, monitor performance, and optimize until it runs like clockwork." },
];

const ProcessSection = () => {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">
            From Chaos to <span className="text-gradient">Clockwork</span> in 4 Steps
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven approach used by our software development company to deliver reliable custom software — on time and on budget.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <span className="block text-2xl md:text-4xl font-bold text-accent mb-2">{s.n}</span>
              <h3 className="text-lg md:text-xl font-display font-semibold mb-2 text-accent">{s.title}</h3>
              <p className="text-sm md:text-md text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
