//
//  ContentView.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var viewModel: ViewModel
    @State private var currentTime = Date()
    
    var body: some View {
        NavigationView {
            VStack {
                Spacer()
                
                Group {
                    Text("\(viewModel.model.notificationCount)")
                        .font(.largeTitle)
                        .bold()
                        .padding(5)
                    Text("\(viewModel.model.lastNotificationDate, formatter: DateFormatter.timeFormatter)")
                        .font(.title)
                    Text("\(currentTime, formatter: DateFormatter.timeFormatter)")
                        .font(.title)
                        .onAppear {
                            let timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                                currentTime = Date()
                            }
                            RunLoop.current.add(timer, forMode: .common)
                        }
                    
                    
                    Button {
                        viewModel.sendNotificationNow()
                    } label: {
                        Text("Send notification")
                            .foregroundColor(.blue)
                            .padding(5)
                    }
                    .buttonStyle(.bordered)
                    .padding(5)
                }
                
                Spacer()
                
                Text("Scheduling \(viewModel.model.scheduleOn ? "ON" : "OFF")")
                    .padding(5)
                    .font(.title3)
                    .foregroundColor(viewModel.model.scheduleOn ? .green : .gray)
                Text("\(viewModel.model.scheduleStartedAt, formatter: DateFormatter.timeFormatter)")
                    .font(.title)
                    .padding(.bottom, 10)
                
                Button {
                    viewModel.startNotificationSchedule()
                } label: {
                    Text("Start schedule")
                        .foregroundColor(.blue)
                        .padding(5)
                }
                .buttonStyle(.bordered)
                
                Button {
                    viewModel.stopNotificationSchedule()
                } label: {
                    Text("Stop schedule")
                        .foregroundColor(.red)
                        .padding(5)
                }
                .padding(20)
                
                Spacer()
                
                Button {
                    viewModel.resetModel()
                } label: {
                    Text("Reset")
                        .foregroundColor(.red)
                        .padding(5)
                }
                .padding(20)
            }
            .sheet(isPresented: $viewModel.showNotificationRequest) {
                NotificationPermissionRequest()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static let viewModel = ViewModel()
    
    static var previews: some View {
        ContentView().environmentObject(viewModel)
    }
}

extension DateFormatter {
    static let timeFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        return formatter
    }()
}
