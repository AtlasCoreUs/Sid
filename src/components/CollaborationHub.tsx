import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import type { Collaborator, Workspace } from '../types';

interface CollaborationHubProps {
  noteId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  replies: Comment[];
  resolved: boolean;
}

interface Activity {
  id: string;
  type: 'edit' | 'comment' | 'share' | 'mention';
  user: string;
  description: string;
  timestamp: Date;
}

export function CollaborationHub({ noteId, isVisible, onClose }: CollaborationHubProps): JSX.Element | null {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'share' | 'team'>('comments');
  
  const { getNoteById, currentWorkspace } = useAppStore();
  const note = getNoteById(noteId);

  useEffect(() => {
    if (isVisible && note) {
      // Simuler des données de collaboration
      setComments([
        {
          id: '1',
          author: 'Alice Martin',
          content: 'Excellente idée ! Je suggère d\'ajouter une section sur les métriques de performance.',
          timestamp: new Date(Date.now() - 3600000),
          replies: [],
          resolved: false,
        },
        {
          id: '2',
          author: 'Bob Dupont',
          content: 'Je suis d\'accord avec Alice. Voici quelques suggestions de métriques :',
          timestamp: new Date(Date.now() - 1800000),
          replies: [
            {
              id: '2.1',
              author: 'Alice Martin',
              content: 'Parfait ! J\'ajoute ces métriques.',
              timestamp: new Date(Date.now() - 900000),
              replies: [],
              resolved: true,
            },
          ],
          resolved: true,
        },
      ]);

      setActivities([
        {
          id: '1',
          type: 'edit',
          user: 'Alice Martin',
          description: 'a modifié la section "Objectifs"',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: '2',
          type: 'comment',
          user: 'Bob Dupont',
          description: 'a ajouté un commentaire',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          type: 'share',
          user: 'Alice Martin',
          description: 'a partagé la note avec l\'équipe',
          timestamp: new Date(Date.now() - 1800000),
        },
      ]);

      setCollaborators([
        {
          id: '1',
          email: 'alice@example.com',
          name: 'Alice Martin',
          role: 'editor',
          joinedAt: new Date(Date.now() - 86400000),
          lastActive: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          email: 'bob@example.com',
          name: 'Bob Dupont',
          role: 'viewer',
          joinedAt: new Date(Date.now() - 172800000),
          lastActive: new Date(Date.now() - 1800000),
        },
      ]);
    }
  }, [isVisible, note]);

  const addComment = (): void => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Vous',
      content: newComment,
      timestamp: new Date(),
      replies: [],
      resolved: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');

    // Ajouter activité
    const activity: Activity = {
      id: Date.now().toString(),
      type: 'comment',
      user: 'Vous',
      description: 'a ajouté un commentaire',
      timestamp: new Date(),
    };
    setActivities([activity, ...activities]);
  };

  const generateShareLink = (): void => {
    setIsSharing(true);
    setTimeout(() => {
      setShareLink(`https://sid-hud.com/share/${noteId}`);
      setIsSharing(false);
    }, 1000);
  };

  const inviteCollaborator = (): void => {
    if (!inviteEmail.trim()) return;

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: inviteEmail,
      name: inviteEmail.split('@')[0],
      role: 'viewer',
      joinedAt: new Date(),
    };

    setCollaborators([...collaborators, newCollaborator]);
    setInviteEmail('');

    // Ajouter activité
    const activity: Activity = {
      id: Date.now().toString(),
      type: 'share',
      user: 'Vous',
      description: `a invité ${newCollaborator.name}`,
      timestamp: new Date(),
    };
    setActivities([activity, ...activities]);
  };

  if (!isVisible || !note) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="collaboration-hub"
      >
        <div className="hub-header">
          <h3>🤝 Collaboration</h3>
          <button onClick={onClose} className="hub-close-btn">×</button>
        </div>

        <div className="hub-tabs">
          <button
            className={`hub-tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Commentaires ({comments.length})
          </button>
          <button
            className={`hub-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📊 Activité ({activities.length})
          </button>
          <button
            className={`hub-tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            🔗 Partage
          </button>
          <button
            className={`hub-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            👥 Équipe ({collaborators.length})
          </button>
        </div>

        <div className="hub-content">
          {activeTab === 'comments' && (
            <div className="comments-section">
              <div className="comment-input">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  rows={3}
                />
                <button onClick={addComment} disabled={!newComment.trim()}>
                  Commenter
                </button>
              </div>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className={`comment ${comment.resolved ? 'resolved' : ''}`}>
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">
                        {comment.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    {comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="comment-reply">
                            <div className="comment-header">
                              <span className="comment-author">{reply.author}</span>
                              <span className="comment-time">
                                {reply.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="comment-content">{reply.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-section">
              <div className="activity-list">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'edit' && '✏️'}
                      {activity.type === 'comment' && '💬'}
                      {activity.type === 'share' && '🔗'}
                      {activity.type === 'mention' && '👤'}
                    </div>
                    <div className="activity-content">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-description">{activity.description}</span>
                      <span className="activity-time">
                        {activity.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="share-section">
              <div className="share-options">
                <h4>🔗 Partager cette note</h4>
                
                <div className="share-link-section">
                  <button
                    onClick={generateShareLink}
                    disabled={isSharing}
                    className="generate-link-btn"
                  >
                    {isSharing ? 'Génération...' : 'Générer un lien de partage'}
                  </button>
                  
                  {shareLink && (
                    <div className="share-link">
                      <input type="text" value={shareLink} readOnly />
                      <button onClick={() => navigator.clipboard.writeText(shareLink)}>
                        Copier
                      </button>
                    </div>
                  )}
                </div>

                <div className="invite-section">
                  <h4>📧 Inviter des collaborateurs</h4>
                  <div className="invite-input">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="email@exemple.com"
                    />
                    <button onClick={inviteCollaborator} disabled={!inviteEmail.trim()}>
                      Inviter
                    </button>
                  </div>
                </div>

                <div className="share-permissions">
                  <h4>🔐 Permissions</h4>
                  <div className="permission-options">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Permettre les commentaires
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Permettre l'édition
                    </label>
                    <label>
                      <input type="checkbox" />
                      Demander l'approbation
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-section">
              <div className="team-members">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="team-member">
                    <div className="member-avatar">
                      {collaborator.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{collaborator.name}</span>
                      <span className="member-email">{collaborator.email}</span>
                      <span className="member-role">{collaborator.role}</span>
                      <span className="member-status">
                        {collaborator.lastActive && 
                         Date.now() - collaborator.lastActive.getTime() < 300000
                          ? '🟢 En ligne'
                          : '⚪ Hors ligne'}
                      </span>
                    </div>
                    <div className="member-actions">
                      <button className="member-action-btn">Modifier</button>
                      <button className="member-action-btn remove">Retirer</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="team-stats">
                <h4>📊 Statistiques de l'équipe</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{collaborators.length}</span>
                    <span className="stat-label">Membres</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{comments.length}</span>
                    <span className="stat-label">Commentaires</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{activities.length}</span>
                    <span className="stat-label">Activités</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}