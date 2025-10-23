import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import Link from 'next/link';

interface MobileUnsupportedNoticeProps {
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function MobileUnsupportedNotice({
  title,
  description = 'This interactive is best experienced on a larger screen. Please switch to a tablet or desktop to continue.',
  ctaHref = '/',
  ctaLabel = 'Back to home',
}: MobileUnsupportedNoticeProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="border-dashed border-leiden/30 bg-muted/40 text-center shadow-sm">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leiden/10">
            <Smartphone className="h-7 w-7 text-leiden" />
          </div>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p>{description}</p>
          <Button asChild size="lg" variant="outline" className="font-medium">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
