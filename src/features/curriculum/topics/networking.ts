import { Network } from "lucide-react";
import type { Topic } from "../types";
import { networkingTutor } from "../prompts/networking-tutor";

export const networkingTopic: Topic = {
  id: "networking",
  slug: "networking",
  name: "Networking / רשתות",
  description: "TCP/IP, DNS, HTTP — what actually happens on the wire.",
  track: "devops",
  icon: Network,
  accent: {
    gradient: "from-cyan-500 to-blue-600",
    text: "text-cyan-600",
    ring: "ring-cyan-500/30",
  },
  tutor: networkingTutor,
  modules: [
    {
      id: "net-intro",
      title: "What is a Network",
      emoji: "🕸️",
      description: "Hosts, clients, servers, LAN vs. WAN.",
      lessons: [
        {
          id: "net-intro-01",
          level: "beginner",
          title: "Network basics",
          description: "Nodes, links, the internet as a network of networks.",
          objectives: [
            "Name the roles: client, server, peer",
            "Distinguish LAN from WAN",
            "Explain the internet as a network of networks",
          ],
          keyTerms: ["LAN", "WAN", "client", "server", "internet"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "net-osi",
      title: "OSI & TCP/IP Models",
      emoji: "📐",
      description: "Layering protocols.",
      lessons: [
        {
          id: "net-osi-01",
          level: "beginner",
          title: "The 7-layer model",
          description: "What each OSI layer does.",
          objectives: [
            "Name each OSI layer in order",
            "Map TCP/IP's 4 layers to OSI",
            "Explain why layering matters",
          ],
          keyTerms: ["OSI", "TCP/IP", "encapsulation", "layer"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "net-ip",
      title: "IP Addresses",
      emoji: "🏷️",
      description: "IPv4, IPv6, CIDR, subnetting.",
      lessons: [
        {
          id: "net-ip-01",
          level: "intermediate",
          title: "IPv4 addressing",
          description: "Dotted quad, public vs. private, loopback.",
          objectives: [
            "Read an IPv4 address",
            "Recognise private ranges",
            "Identify loopback",
          ],
          keyTerms: ["IPv4", "192.168.x.x", "10.x.x.x", "127.0.0.1"],
          practiceQuestions: 4,
        },
        {
          id: "net-ip-02",
          level: "advanced",
          title: "CIDR & subnets",
          description: "Slicing networks.",
          objectives: [
            "Compute subnet size from /N",
            "Split a /24 into smaller subnets",
            "Know the broadcast and network addresses",
          ],
          keyTerms: ["CIDR", "/24", "subnet mask", "broadcast"],
          practiceQuestions: 5,
        },
      ],
    },
    {
      id: "net-dns",
      title: "DNS",
      emoji: "📖",
      description: "Names, records, caching.",
      lessons: [
        {
          id: "net-dns-01",
          level: "intermediate",
          title: "How a DNS lookup works",
          description: "Recursive, authoritative, root servers.",
          objectives: [
            "Trace a lookup from client to authoritative",
            "Explain caching and TTL",
            "Use `dig` to inspect a record",
          ],
          keyTerms: ["DNS", "recursive", "authoritative", "TTL", "dig"],
          practiceQuestions: 4,
        },
        {
          id: "net-dns-02",
          level: "intermediate",
          title: "Record types",
          description: "A, AAAA, CNAME, MX, TXT.",
          objectives: [
            "Pick the right record for a use case",
            "Recognise a CNAME chain",
            "Explain how MX records route mail",
          ],
          keyTerms: ["A", "AAAA", "CNAME", "MX", "TXT"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "net-http",
      title: "HTTP / HTTPS",
      emoji: "🌐",
      description: "The web's protocol.",
      lessons: [
        {
          id: "net-http-01",
          level: "intermediate",
          title: "Requests & responses",
          description: "Methods, status codes, headers.",
          objectives: [
            "Describe an HTTP request line",
            "Classify a status code by its first digit",
            "Read common headers (Content-Type, Authorization)",
          ],
          keyTerms: ["GET", "POST", "200", "404", "headers"],
          practiceQuestions: 5,
        },
        {
          id: "net-http-02",
          level: "advanced",
          title: "HTTPS & TLS",
          description: "Certificates, the handshake, trust.",
          objectives: [
            "Outline the TLS handshake",
            "Explain why we need certificates",
            "Spot a mixed-content issue",
          ],
          keyTerms: ["TLS", "certificate", "CA", "SNI"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "net-tcp",
      title: "TCP & UDP",
      emoji: "🚚",
      description: "Reliable vs. fast delivery.",
      lessons: [
        {
          id: "net-tcp-01",
          level: "intermediate",
          title: "TCP three-way handshake",
          description: "SYN / SYN-ACK / ACK.",
          objectives: [
            "Draw a handshake diagram",
            "Explain reliability guarantees",
            "Identify a RST packet",
          ],
          keyTerms: ["TCP", "SYN", "ACK", "handshake"],
          practiceQuestions: 4,
        },
        {
          id: "net-tcp-02",
          level: "intermediate",
          title: "When to pick UDP",
          description: "DNS, video, games.",
          objectives: [
            "Explain UDP trade-offs",
            "Name 3 protocols that use UDP",
            "Know what UDP does NOT give you",
          ],
          keyTerms: ["UDP", "stateless", "DNS", "RTP"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "net-ports",
      title: "Ports & Firewalls",
      emoji: "🛡️",
      description: "Controlling who can talk to what.",
      lessons: [
        {
          id: "net-ports-01",
          level: "intermediate",
          title: "Well-known ports",
          description: "80, 443, 22, 53.",
          objectives: [
            "Memorise the top 10 well-known ports",
            "Distinguish well-known vs. ephemeral",
            "Understand ports as multiplexing",
          ],
          keyTerms: ["port", "22", "53", "80", "443"],
          practiceQuestions: 3,
        },
        {
          id: "net-ports-02",
          level: "advanced",
          title: "Firewalls",
          description: "iptables / ufw / cloud security groups.",
          objectives: [
            "Write a simple ufw rule",
            "Explain stateful filtering",
            "Map firewall rules to AWS security groups",
          ],
          keyTerms: ["iptables", "ufw", "security group", "stateful"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "net-trouble",
      title: "Troubleshooting",
      emoji: "🩺",
      description: "Finding the broken layer.",
      lessons: [
        {
          id: "net-tr-01",
          level: "advanced",
          title: "ping, traceroute, dig, curl -v",
          description: "Tools for each layer.",
          objectives: [
            "Pick the right tool for a symptom",
            "Read a traceroute",
            "Inspect TLS with curl -v",
          ],
          keyTerms: ["ping", "traceroute", "dig", "curl -v"],
          practiceQuestions: 4,
        },
      ],
    },
  ],
};
