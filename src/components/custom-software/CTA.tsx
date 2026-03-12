"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cover } from "@/components/ui/cover";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-accent via-accent/80 to-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
            Build your custom software at{" "}
            <Cover>warp speed</Cover>
          </h2>
          <p className="text-md md:text-lg mb-8 text-muted-foreground">
            While your competitors automate and scale, you're still
            copy-pasting. Talk to our team and get a tailored plan from a
            trusted software development company in Malaysia.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="bg-foreground text-background px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <Cover>Schedule a Consultation</Cover>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
