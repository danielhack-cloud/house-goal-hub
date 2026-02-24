import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Send, MessageSquare, Lightbulb, Users, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface FeedPost {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  user_id: string;
  profiles: { display_name: string; avatar_url: string | null } | null;
}

const typeIcons: Record<string, typeof MessageSquare> = {
  question: MessageSquare,
  tip: Lightbulb,
  discussion: Users,
  milestone: Trophy,
};

const typeLabels: Record<string, string> = {
  question: "Question",
  tip: "Tip",
  discussion: "Discussion",
  milestone: "Milestone",
};

const LiveFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("question");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("feed_posts")
      .select("*, profiles(display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setPosts(data as unknown as FeedPost[]);
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("feed_posts_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_posts" },
        () => fetchPosts()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handlePost = async () => {
    if (!content.trim() || !user) return;
    setSubmitting(true);

    const { error } = await supabase.from("feed_posts").insert({
      content: content.trim(),
      post_type: postType,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error posting", description: error.message, variant: "destructive" });
    } else {
      setContent("");
    }
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" /> Live Feed
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ask questions, share tips, and connect with the HomeDollars community
        </p>
      </div>

      {/* New Post */}
      {user ? (
        <Card className="mb-6 p-4">
          <Textarea
            placeholder="Ask a question, share a tip, or start a discussion..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3 min-h-[80px] resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">❓ Question</SelectItem>
                <SelectItem value="tip">💡 Tip</SelectItem>
                <SelectItem value="discussion">💬 Discussion</SelectItem>
                <SelectItem value="milestone">🏆 Milestone</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePost} disabled={submitting || !content.trim()}>
              <Send className="mr-1.5 h-4 w-4" />
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="mb-6 p-4 text-center text-muted-foreground">
          <p>Sign in to post and interact with the community.</p>
        </Card>
      )}

      {/* Feed */}
      {posts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No posts yet. Be the first to start a conversation!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const Icon = typeIcons[post.post_type] || MessageSquare;
            const initials = (post.profiles?.display_name || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Card key={post.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">
                        {post.profiles?.display_name || "Anonymous"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Icon className="h-3 w-3" />
                        {typeLabels[post.post_type]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LiveFeed;
