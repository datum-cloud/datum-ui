import type { ColorScheme, Status } from '@datum-cloud/datum-ui-native'
import type { ReactNode } from 'react'
import {
  Alert,
  ALERT_TYPES,
  Avatar,
  Badge,
  BADGE_THEMES,
  BADGE_TYPES,
  Button,
  BUTTON_SIZES,
  BUTTON_THEMES,
  BUTTON_TYPES,
  Card,
  CardContent,
  CardDescription,
  CardField,
  CardFooter,
  CardHeader,
  CardTitle,
  datumFonts,
  DatumThemeProvider,
  EmptyContent,
  LogoFlat,
  LogoIcon,
  LogoStacked,
  Separator,
  Skeleton,
  Spinner,
  StatusBadge,
  Text,
  Title,
  useDatumTheme,
} from '@datum-cloud/datum-ui-native'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ScrollView, useColorScheme, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

type Mode = ColorScheme | 'split'

const STATUSES: Status[] = ['pending', 'success', 'error', 'unknown']

function Section({ title, children }: { title: string, children: ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Text size="2xs" weight="semibold" tone="muted" style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {title}
      </Text>
      {children}
    </View>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</View>
}

function Typography() {
  return (
    <Section title="Typography">
      <Title level={1}>Title level 1</Title>
      <Title level={2}>Title level 2</Title>
      <Title level={3}>Title level 3</Title>
      <Title level={4}>Title level 4</Title>
      <Title level={5}>Title level 5</Title>
      <Title level={6}>Title level 6</Title>
      <Title level={7}>Title level 7</Title>
      <Text size="base">Body base — the 16px reading size.</Text>
      <Text>Body sm — the default 14px step.</Text>
      <Row>
        <Text weight="medium">Medium</Text>
        <Text weight="semibold">Semibold</Text>
        <Text tone="muted">Muted</Text>
        <Text tone="primary">Primary</Text>
        <Text tone="destructive">Destructive</Text>
        <Text tone="success">Success</Text>
        <Text tone="warning">Warning</Text>
      </Row>
      <Text mono size="xs">kubectl get httpproxies -n default</Text>
    </Section>
  )
}

function Buttons() {
  const [loading, setLoading] = useState(false)
  return (
    <Section title="Button">
      {BUTTON_THEMES.map(theme => (
        <Row key={theme}>
          {BUTTON_TYPES.map(type => (
            <Button key={type} type={type} theme={theme} size="small">{type}</Button>
          ))}
        </Row>
      ))}
      <Row>
        {BUTTON_SIZES.filter(s => s !== 'icon' && s !== 'link').map(size => (
          <Button key={size} size={size}>{size}</Button>
        ))}
      </Row>
      <Row>
        <Button
          loading={loading}
          onPress={() => {
            setLoading(true)
            setTimeout(setLoading, 1500, false)
          }}
        >
          {loading ? 'Saving' : 'Tap to load'}
        </Button>
        <Button size="icon" accessibilityLabel="Datum" icon={<LogoIcon size={16} tone="white" decorative />} type="secondary" />
        <Button theme="outline" icon={({ color }) => <Text style={{ color }}>+</Text>}>With icon</Button>
      </Row>
      <Button block type="tertiary">Block</Button>
    </Section>
  )
}

function Badges() {
  const [index, setIndex] = useState(0)
  const status = STATUSES[index % STATUSES.length]!
  return (
    <Section title="Badge · StatusBadge">
      {BADGE_THEMES.map(theme => (
        <Row key={theme}>
          {BADGE_TYPES.map(type => <Badge key={type} type={type} theme={theme}>{type}</Badge>)}
        </Row>
      ))}
      <Row>
        {STATUSES.map(s => <StatusBadge key={s} status={s} />)}
      </Row>
      <Row>
        <StatusBadge status={status} />
        <Button size="xs" theme="light" onPress={() => setIndex(i => i + 1)}>Cycle status</Button>
      </Row>
    </Section>
  )
}

function Cards() {
  return (
    <Section title="Card">
      <Card>
        <CardHeader action={<StatusBadge status="success" label="Ready" />}>
          <CardTitle>api-gateway</CardTitle>
          <CardDescription>HTTPProxy · default</CardDescription>
        </CardHeader>
        <CardContent>
          <Text tone="muted">Routes traffic for api.example.com to two backends.</Text>
        </CardContent>
        <CardFooter>
          <Button size="small" theme="light">View</Button>
          <Button size="small" theme="borderless">Copy ID</Button>
        </CardFooter>
      </Card>
      <Card sectioned size="sm">
        <CardHeader bordered><CardTitle>Details</CardTitle></CardHeader>
        <CardContent padding="none">
          <CardField label="Hostname" value="api.example.com" />
          <CardField label="Certificate"><Badge type="success" theme="light">Issued</Badge></CardField>
          <CardField label="Created" value="12 Oct 2026" />
        </CardContent>
      </Card>
    </Section>
  )
}

function Alerts() {
  return (
    <Section title="Alert">
      {ALERT_TYPES.map(type => (
        <Alert key={type} type={type} title={`${type[0]!.toUpperCase()}${type.slice(1)} alert`} description="Something worth knowing about this resource." />
      ))}
    </Section>
  )
}

function Feedback() {
  return (
    <Section title="Skeleton · Spinner · Separator · Avatar">
      <View style={{ gap: 8 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton height={14} />
        <Skeleton width={120} height={40} radius={6} />
      </View>
      <Row>
        <Spinner />
        <Spinner tone="primary" size="large" />
      </Row>
      <Separator />
      <Row>
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Katherine Johnson" size="lg" />
        <Avatar name="Margaret Hamilton" size="xl" />
      </Row>
    </Section>
  )
}

function Logos() {
  return (
    <Section title="Logo">
      <Row>
        <LogoIcon />
        <LogoFlat />
        <LogoStacked height={40} />
      </Row>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {(['brand', 'mono-light', 'mono-dark', 'white'] as const).map(tone => (
          <View
            key={tone}
            style={{
              padding: 10,
              borderRadius: 6,
              backgroundColor: tone === 'brand' || tone === 'mono-dark' ? '#f6f6f5' : '#0c1d31',
            }}
          >
            <LogoFlat tone={tone} height={18} />
          </View>
        ))}
      </View>
    </Section>
  )
}

function Empty() {
  return (
    <Section title="EmptyContent">
      <EmptyContent
        title="No proxies yet"
        description="Create an HTTP proxy in the portal to see it here."
        action={<Button size="xs" type="secondary">Refresh</Button>}
      />
    </Section>
  )
}

function Catalog() {
  const t = useDatumTheme()
  return (
    <View style={{ backgroundColor: t.colors.background, padding: 16, gap: 28 }}>
      <Row>
        <Title level={3}>{t.scheme === 'dark' ? 'Dark' : 'Light'}</Title>
      </Row>
      <Typography />
      <Buttons />
      <Badges />
      <Cards />
      <Alerts />
      <Feedback />
      <Logos />
      <Empty />
    </View>
  )
}

function Toolbar({ mode, onChange }: { mode: Mode, onChange: (mode: Mode) => void }) {
  const t = useDatumTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: t.colors.border,
        backgroundColor: t.colors.background,
      }}
    >
      <LogoFlat height={18} />
      <View style={{ flex: 1 }} />
      {(['light', 'dark', 'split'] as const).map(m => (
        <Button key={m} size="xs" theme={mode === m ? 'solid' : 'light'} type="secondary" onPress={() => onChange(m)}>
          {m}
        </Button>
      ))}
    </View>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts(datumFonts)
  const system = useColorScheme()
  const [mode, setMode] = useState<Mode>('split')
  const chrome: ColorScheme = mode === 'split' ? (system === 'dark' ? 'dark' : 'light') : mode

  if (!fontsLoaded)
    return null

  return (
    <SafeAreaProvider>
      <DatumThemeProvider scheme={chrome}>
        <StatusBar style={chrome === 'dark' ? 'light' : 'dark'} />
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: chrome === 'dark' ? '#0c1d31' : '#f6f6f5' }}>
          <Toolbar mode={mode} onChange={setMode} />
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {mode === 'split'
              ? (
                  <>
                    <DatumThemeProvider scheme="light"><Catalog /></DatumThemeProvider>
                    <DatumThemeProvider scheme="dark"><Catalog /></DatumThemeProvider>
                  </>
                )
              : <Catalog />}
          </ScrollView>
        </SafeAreaView>
      </DatumThemeProvider>
    </SafeAreaProvider>
  )
}
