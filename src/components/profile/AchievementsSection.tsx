
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Star, Target, TrendingUp, Calendar, Users, FileText } from 'lucide-react';

export const AchievementsSection = () => {
  const badges = [
    {
      id: 1,
      name: 'First Login',
      description: 'Completed your first login to the system',
      icon: Star,
      earned: true,
      earnedDate: '2024-01-15',
      rarity: 'common',
      points: 10
    },
    {
      id: 2,
      name: 'Data Explorer',
      description: 'Imported your first dataset',
      icon: FileText,
      earned: true,
      earnedDate: '2024-01-16',
      rarity: 'common',
      points: 25
    },
    {
      id: 3,
      name: 'Forecast Master',
      description: 'Generated 10 forecasting reports',
      icon: TrendingUp,
      earned: true,
      earnedDate: '2024-02-01',
      rarity: 'uncommon',
      points: 100
    },
    {
      id: 4,
      name: 'Analytics Pro',
      description: 'Viewed analytics dashboard 50 times',
      icon: Target,
      earned: false,
      progress: 35,
      total: 50,
      rarity: 'rare',
      points: 200
    },
    {
      id: 5,
      name: 'Team Player',
      description: 'Collaborate with 5 different users',
      icon: Users,
      earned: false,
      progress: 2,
      total: 5,
      rarity: 'uncommon',
      points: 75
    },
    {
      id: 6,
      name: 'Streak Legend',
      description: 'Login for 30 consecutive days',
      icon: Calendar,
      earned: false,
      progress: 7,
      total: 30,
      rarity: 'legendary',
      points: 500
    }
  ];

  const totalPoints = badges.filter(b => b.earned).reduce((sum, badge) => sum + badge.points, 0);
  const totalBadges = badges.filter(b => b.earned).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{totalBadges}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Badges and Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id} className={`${badge.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${badge.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <badge.icon className={`h-6 w-6 ${badge.earned ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <Badge variant="secondary" className={getRarityColor(badge.rarity)}>
                      {badge.rarity}
                    </Badge>
                  </div>
                  
                  <h3 className={`font-semibold mb-1 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-sm mb-3 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                  
                  {badge.earned ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600 font-medium">Earned</span>
                      <span className="text-gray-500">{badge.earnedDate}</span>
                    </div>
                  ) : badge.progress !== undefined ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{badge.progress}/{badge.total}</span>
                      </div>
                      <Progress value={(badge.progress / badge.total) * 100} className="h-2" />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Not started</div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 mr-1" />
                      {badge.points} points
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">Forecast Master</div>
                <div className="text-sm text-gray-600">Generated 10 forecasting reports</div>
              </div>
              <div className="text-sm text-gray-500">Feb 1, 2024</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Data Explorer</div>
                <div className="text-sm text-gray-600">Imported your first dataset</div>
              </div>
              <div className="text-sm text-gray-500">Jan 16, 2024</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium">First Login</div>
                <div className="text-sm text-gray-600">Completed your first login to the system</div>
              </div>
              <div className="text-sm text-gray-500">Jan 15, 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
