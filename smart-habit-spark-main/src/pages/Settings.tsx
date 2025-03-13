// src/pages/Settings.tsx
import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import GlassMorphism from '@/components/ui/GlassMorphism';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Brain,
  Clock,
  CloudSun,
  Fingerprint,
  Languages,
  Moon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';

interface SettingSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { settings, updateSetting } = useSettings();

  const handleSettingChange = (key: keyof typeof settings, value: boolean | string) => {
    updateSetting(key, value);
    toast({
      title: 'Setting updated',
      description: `${key} preference has been saved and synced in real-time.`,
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto max-w-2xl px-4 pb-24 pt-6 md:pb-16 md:pt-24">
        <div className="mb-8 space-y-2 text-center md:mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <SettingsIcon className="h-8 w-8 text-primary" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            App <span className="text-gradient">Settings</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <GlassMorphism>
            <div className="divide-y">
              <SettingSection
                icon={Bell}
                title="Push Notifications"
                description="Get reminders for your daily habits"
              >
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </SettingSection>

              <SettingSection
                icon={Brain}
                title="AI Suggestions"
                description="Receive personalized habit recommendations"
              >
                <Switch
                  checked={settings.aiSuggestions}
                  onCheckedChange={(checked) => handleSettingChange('aiSuggestions', checked)}
                />
              </SettingSection>

              <SettingSection
                icon={Moon}
                title="Dark Mode"
                description="Toggle between light and dark theme"
              >
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </SettingSection>
            </div>
          </GlassMorphism>

          <GlassMorphism>
            <div className="divide-y">
              <SettingSection
                icon={CloudSun}
                title="Auto Sync"
                description="Keep your data synced across devices"
              >
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
                />
              </SettingSection>

              <SettingSection
                icon={Clock}
                title="Time Zone"
                description="Automatically adjust to your location"
              >
                <Switch
                  checked={settings.timeZone}
                  onCheckedChange={(checked) => handleSettingChange('timeZone', checked)}
                />
              </SettingSection>

              <SettingSection
                icon={Languages}
                title="Language"
                description="Choose your preferred language"
              >
                <select
                  className="rounded-md bg-white/50 px-2 py-1 text-sm dark:bg-black/20"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </SettingSection>
            </div>
          </GlassMorphism>

          <GlassMorphism>
            <div className="divide-y">
              <SettingSection
                icon={Fingerprint}
                title="Privacy"
                description="Manage your data and privacy settings"
              >
                <Switch
                  checked={settings.privacy}
                  onCheckedChange={(checked) => handleSettingChange('privacy', checked)}
                />
              </SettingSection>
            </div>
          </GlassMorphism>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            SmartStreaks v1.0.0
          </motion.p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Settings;