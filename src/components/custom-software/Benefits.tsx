import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="py-12 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Off-the-Shelf Software vs <span className="text-gradient">Custom-Built</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Generic software forces you to change your workflow. Custom software fits YOUR workflow — and grows with your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before - Off the shelf */}
          <motion.div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-card"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-sm font-bold text-destructive">Off-the-Shelf Software</span>
            </div>
            <ul className="space-y-3">
              {[
                "Paying for 100 features you don't use",
                "Monthly subscriptions that never end",
                "Forces your team to change their workflow",
                "No competitive advantage — competitors use the same tool",
                "Data trapped in someone else's system",
              ].map((item, i) => (
                <li key={i} className="flex items-start text-muted-foreground">
                  <X className="h-4 w-4 text-destructive mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After - Custom */}
          <motion.div className="rounded-2xl border border-accent/30 bg-card p-6 shadow-card shadow-glow"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-accent">Custom Software by Leadzap</span>
            </div>
            <ul className="space-y-3">
              {[
                "Every feature built for YOUR exact workflow",
                "One-time investment that pays for itself in months",
                "Your team works faster from day one — zero learning curve",
                "Unique competitive advantage nobody can copy",
                "Your data, your system, your rules",
              ].map((item, i) => (
                <li key={i} className="flex items-start text-foreground">
                  <CheckCircle className="h-4 w-4 text-accent mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
