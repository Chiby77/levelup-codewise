export interface NetworkingConcept {
  explanation: string;
  example?: string;
  components?: string[];
}

export const networkingConcepts: Record<string, NetworkingConcept> = {
  "tcp/ip": {
    explanation: "TCP/IP (Transmission Control Protocol/Internet Protocol) is the fundamental communication protocol of the internet. It's a layered protocol stack consisting of:\n\n1. Application Layer (HTTP, FTP, SMTP)\n2. Transport Layer (TCP, UDP)\n3. Internet Layer (IP, ICMP)\n4. Network Access Layer (Ethernet, Wi-Fi)",
    components: [
      "TCP - Handles reliable data transmission",
      "IP - Manages addressing and routing",
      "Ports - Enable multiple services on same device",
      "Packets - Units of data transmission"
    ]
  },
  "dns": {
    explanation: "DNS (Domain Name System) is like the internet's phone book, translating human-readable domain names into IP addresses.",
    example: "When you type www.example.com, DNS resolves it to something like 93.184.216.34"
  }
};