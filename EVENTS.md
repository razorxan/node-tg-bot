
| Event Name              | Returns                                                     | Event Details                                                                  |
|-------------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------|
| update                  | Istance of Update                                           | An update has been recieved                                                    |
| *                       | Command as String, Array of parameters, Instance of Message | Unknown command recieved                                                       |
| text_only               | Instance of Message                                         | Text only message. (only available when setprivacy is disabled)                |
| from.                   | Instance of Message                                         | A message from a specific user has been recieved                               |
| text                    | Instance of Message                                         | A text message has been recieved                                               |
| audio                   | Instance of Message                                         | An audio has been recieved                                                     |
| document                | Instance of Message                                         | A document has been recieved                                                   |
| photo                   | Instance of Message                                         | A photo has been recieved                                                      |
| sticker                 | Instance of Message                                         | A sticker has been recieved                                                    |
| video                   | Instance of Message                                         | A video has been recieved                                                      |
| voice                   | Instance of Message                                         | A voice message has been recieved                                              |
| contact                 | Instance of Message                                         | A contact has been recieved                                                    |
| location                | Instance of Message                                         | A location has been recieved                                                   |
| venue                   | Instance of Message                                         | A venue has been recieved                                                      |
| new_chat_member         | Instance of Message                                         | A new member joined the chat                                                   |
| left_chat_member        | Instance of Message                                         | A chat member left the chat                                                    |
| new_chat_title          | Instance of Message                                         | A chat title was changed                                                       |
| new_chat_photo          | Instance of Message                                         | The chat photo was changed                                                     |
| delete_chat_photo       | Instance of Message                                         | The chat photo has been deleted                                                |
| group_chat_created      | Instance of Message                                         | The group has been created                                                     |
| supergroup_chat_created | Instance of Message                                         | The supergroup has been created                                                |
| channel_chat_created    | Instance of Message                                         | The channel has been created                                                   |
| migrate_to_chat_id      | Instance of Message                                         | The chat has been migrated to a chat                                           |
| migrate_from_chat_id    | Instance of Message                                         | The chat has been migrated from a chat                                         |
| inline_query            | Instance of Inline Query                                    | An inline query has been sent                                                  |
| chosen_inline_result    | Instance of ChosenInlineResult                              | An inline result has been chosen by a user                                     |
| callback_query          | Instance of CallbackQuery                                   | A callback query has been sent by a user by pressing an inline keyboard button |
