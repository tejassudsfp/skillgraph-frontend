export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#fff9ef" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
            terms of use
          </h1>
          <p className="text-sm mb-12" style={{ color: "#6a6a6a" }}>
            last updated: november 5, 2025
          </p>

          <div className="space-y-8">
            {/* Important Notice */}
            <section className="p-6 border-2 rounded-lg" style={{ borderColor: "#2d2d2d", backgroundColor: "rgba(45, 45, 45, 0.03)" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                important: this is experimental software
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#2d2d2d" }}>
                skillgraph is an <strong>experimental</strong> agentic ai framework. by using this platform, you acknowledge and agree to the following:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-lg" style={{ color: "#2d2d2d" }}>
                  <span className="mr-3">•</span>
                  <strong>no encryption:</strong> conversations are stored in plain text. do not share sensitive information.
                </li>
                <li className="text-lg" style={{ color: "#2d2d2d" }}>
                  <span className="mr-3">•</span>
                  <strong>no guarantees:</strong> this is beta software. expect bugs, downtime, and data loss.
                </li>
                <li className="text-lg" style={{ color: "#2d2d2d" }}>
                  <span className="mr-3">•</span>
                  <strong>use at your own risk:</strong> we are not liable for any damages resulting from your use of this platform.
                </li>
              </ul>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                1. data usage and access
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                by using skillgraph, you explicitly agree that:
              </p>
              <ul className="space-y-3 ml-6" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">
                  <span className="mr-3">•</span>
                  we can <strong>access and review your conversations</strong> to understand how the platform is being used, identify bugs, and improve the system
                </li>
                <li className="text-lg">
                  <span className="mr-3">•</span>
                  we can <strong>access your chat history</strong> to analyze usage patterns, skill performance, and system behavior
                </li>
                <li className="text-lg">
                  <span className="mr-3">•</span>
                  your conversations may be used for <strong>research and development purposes</strong> to improve skillgraph's capabilities
                </li>
                <li className="text-lg">
                  <span className="mr-3">•</span>
                  we may use anonymized conversation data for <strong>training and benchmarking</strong> purposes
                </li>
              </ul>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                2. privacy and security
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                <strong>no encryption:</strong> conversations, messages, and user data are stored in plain text in our database. we do not encrypt data at rest or in transit beyond standard https.
              </p>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                <strong>do not share:</strong>
              </p>
              <ul className="space-y-2 ml-6 mb-4" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">• passwords or credentials</li>
                <li className="text-lg">• personal identification numbers</li>
                <li className="text-lg">• financial information</li>
                <li className="text-lg">• health records</li>
                <li className="text-lg">• any sensitive or private information</li>
              </ul>
              <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
                we store: your email address, conversation history, messages, timestamps, and usage metadata.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                3. third-party services
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                skillgraph uses the following third-party services, each with their own privacy policies:
              </p>
              <ul className="space-y-3 ml-6" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">
                  <strong>anthropic (claude):</strong> your messages are sent to anthropic's api for processing. see <a href="https://www.anthropic.com/privacy" target="_blank" className="underline">anthropic's privacy policy</a>
                </li>
                <li className="text-lg">
                  <strong>sendgrid:</strong> your email address is used to send otp codes. see <a href="https://www.twilio.com/legal/privacy" target="_blank" className="underline">sendgrid's privacy policy</a>
                </li>
                <li className="text-lg">
                  <strong>web search apis:</strong> search queries may be sent to third-party search providers
                </li>
              </ul>
            </section>

            {/* License */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                4. open source license
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                skillgraph is licensed under the <strong>apache license 2.0</strong>. you are free to:
              </p>
              <ul className="space-y-2 ml-6 mb-4" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">• use it commercially</li>
                <li className="text-lg">• modify the source code</li>
                <li className="text-lg">• distribute it</li>
                <li className="text-lg">• use it privately</li>
              </ul>
              <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
                the source code is available at <a href="https://github.com/tejassudsfp/skillgraph" target="_blank" className="underline">github.com/tejassudsfp/skillgraph</a>
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                5. acceptable use
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                you agree not to use skillgraph to:
              </p>
              <ul className="space-y-2 ml-6" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">• generate illegal content</li>
                <li className="text-lg">• harass or harm others</li>
                <li className="text-lg">• spam or abuse the system</li>
                <li className="text-lg">• attempt to hack or exploit vulnerabilities</li>
                <li className="text-lg">• violate any applicable laws or regulations</li>
              </ul>
            </section>

            {/* No Warranty */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                6. no warranty
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                skillgraph is provided "as is" without any warranties, express or implied. we make no guarantees about:
              </p>
              <ul className="space-y-2 ml-6" style={{ color: "#4a4a4a" }}>
                <li className="text-lg">• uptime or availability</li>
                <li className="text-lg">• accuracy of responses</li>
                <li className="text-lg">• data integrity or backup</li>
                <li className="text-lg">• security or privacy</li>
                <li className="text-lg">• fitness for any particular purpose</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                7. limitation of liability
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
                to the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use skillgraph, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                8. data retention and deletion
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                we retain your data indefinitely unless you request deletion. to request deletion of your account and data, email <a href="mailto:t@fanpit.live" className="underline">t@fanpit.live</a>.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
                note: we may retain anonymized data for research purposes even after account deletion.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                9. changes to these terms
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
                we may update these terms at any time. continued use of skillgraph after changes constitutes acceptance of the new terms. check this page regularly for updates.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                10. contact
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "#4a4a4a" }}>
                questions about these terms? contact:
              </p>
              <p className="text-lg" style={{ color: "#4a4a4a" }}>
                tejas parthasarathi sudarshan<br />
                email: <a href="mailto:t@fanpit.live" className="underline">t@fanpit.live</a><br />
                github: <a href="https://github.com/tejassudsfp/skillgraph" target="_blank" className="underline">github.com/tejassudsfp/skillgraph</a>
              </p>
            </section>

            {/* Agreement */}
            <section className="p-6 border-2 rounded-lg" style={{ borderColor: "#2d2d2d", backgroundColor: "rgba(45, 45, 45, 0.03)" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#2d2d2d" }}>
                by using skillgraph, you agree to these terms
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "#2d2d2d" }}>
                if you do not agree to these terms, please do not use skillgraph. you can always <a href="https://github.com/tejassudsfp/skillgraph" target="_blank" className="underline">self-host your own instance</a> with full control over your data.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t-2" style={{ borderColor: "#2d2d2d" }}>
            <p className="text-sm text-center" style={{ color: "#6a6a6a" }}>
              copyright 2025 tejas parthasarathi sudarshan • licensed under apache 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
