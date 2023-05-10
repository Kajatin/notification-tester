//
//  NotificationManager.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import Foundation
import UserNotifications

class NotificationManager: NSObject, UNUserNotificationCenterDelegate {
    private let notificationCenter: UNUserNotificationCenter
    private let identifierTimeToDrink: String
    private let onNotification: () -> Void
    
    //    let midnight = Calendar(identifier: .gregorian).startOfDay(for: Date(timeIntervalSinceNow: 86400))
    
    init(onTimeToDrink: @escaping () -> Void) {
        notificationCenter = UNUserNotificationCenter.current()
        identifierTimeToDrink = "teton-notification-hehe"
        onNotification = onTimeToDrink
        
        super.init()
        
        notificationCenter.delegate = self
    }
    
    func requestAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        notificationCenter.requestAuthorization(options: [.alert, .sound, .badge], completionHandler: completion)
    }
    
    func isAuthorization(completion: @escaping (UNNotificationSettings) -> Void) -> Void {
        notificationCenter.getNotificationSettings(completionHandler: completion)
    }
    
    func scheduleTimeToDrinkNotification(timeInterval: TimeInterval, repeats: Bool, onError: @escaping (Error?) -> Void) {
        let content = UNMutableNotificationContent()
        content.title = "Ding Dong"
        content.body = "Who's there? TETON!"
        content.sound = UNNotificationSound.default
        content.badge = 1
        
        // Fire in 5 seconds
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: timeInterval, repeats: repeats)
        
        // Create the request
        let request = UNNotificationRequest(identifier: identifierTimeToDrink, content: content, trigger: trigger)
        
        // Schedule the request with the system
        notificationCenter.add(request, withCompletionHandler: onError)
    }
    
    func cancelPreviousNotifications() {
        notificationCenter.removeDeliveredNotifications(withIdentifiers: [identifierTimeToDrink])
        notificationCenter.removePendingNotificationRequests(withIdentifiers: [identifierTimeToDrink])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        if (notification.request.identifier == "teton-notification-hehe") {
            onNotification()
        }
        
        completionHandler(.sound)
    }
    
}
