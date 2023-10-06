package game.tictactoe.tarasan.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import game.tictactoe.tarasan.model.TicTacToeGameModel;

@Service
public class TicTacToeService {
  private static TicTacToeGameModel currentTicTacToeGameModel;

  public ResponseEntity<String> move(int row, int col) {
    if (currentTicTacToeGameModel.isGameOver() || currentTicTacToeGameModel.isDraw()) {
      return ResponseEntity.badRequest().body("Game is already over.");
    }

    char currentPlayerSymbol = currentTicTacToeGameModel.getCurrentPlayerModel().getSymbol();

    if (currentTicTacToeGameModel.getBoard().makeMove(row, col, currentPlayerSymbol)) {
      if (currentTicTacToeGameModel.getBoard().isGameOver(row, col, currentPlayerSymbol)) {
        currentTicTacToeGameModel.setGameOver(true);
        return ResponseEntity.ok(currentPlayerSymbol + " wins!");
      } else if (currentTicTacToeGameModel.getBoard().isDraw()) {
        currentTicTacToeGameModel.setDraw(true);
        return ResponseEntity.ok("It's a draw!");
      } else {
        currentTicTacToeGameModel.setCurrentPlayerModel(
            (currentPlayerSymbol == 'X') ? currentTicTacToeGameModel.getPlayerModelO() : currentTicTacToeGameModel.getPlayerModelX()
        );
        return ResponseEntity.ok("Move successful.");
      }
    } else {
      return ResponseEntity.badRequest().body("Invalid move. Try again.");
    }
  }

  public ResponseEntity<String> startNewGame(int size) {
    currentTicTacToeGameModel = new TicTacToeGameModel(size);
    return ResponseEntity.ok("New game started.");
  }

  public ResponseEntity<TicTacToeGameModel> getCurrentState() {
    return ResponseEntity.ok(currentTicTacToeGameModel);
  }

  public ResponseEntity<String> restartCurrentGame() {
    currentTicTacToeGameModel = new TicTacToeGameModel(currentTicTacToeGameModel.getBoard().getBoard().length);
    return ResponseEntity.ok("Game restarted.");
  }
}
